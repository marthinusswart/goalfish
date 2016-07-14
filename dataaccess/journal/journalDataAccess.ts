import mongoose = require('mongoose');
import journal = require('../../models/journal/journal');
import async = require('async');
import journalController = require('../../controllers/journal/journalController');

export class JournalDataAccess {
    connection: mongoose.Connection;
    journalController: journalController.JournalController;
    wasInitialised: boolean = false;
    isConnectionOpening: boolean = false;
    isConnectionOpen: boolean = false;
    journalSchema: any;
    journalModel: any;
    mongooseJournal: any;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.journalController = new journalController.JournalController();

            this.journalSchema = this.journalController.createJournalMongooseSchema();
            this.journalModel = this.connection.model("journal", this.journalSchema, "journal");
            this.mongooseJournal = new this.journalModel();

            this.wasInitialised = true;
            this.isConnectionOpening = true;
            this.connection.on("close", function () {
                self.onConnectionClose();
            });

            this.connection.on("open", function () {
                self.onConnectionOpen();
            });
        } else {
            throw new ReferenceError("Can't initialise again");
        }

    }

    cleanUp() {
        if (this.wasInitialised) {
            this.connection.close();
        }
    }

    find(accounts:string[], callback, closeConnection: boolean = false) {
        if (!this.wasInitialised) {
            throw new ReferenceError("Journal Data Access module was not initialised");
        }

        var self = this;

        var findFunc = (function () {
            self.journalModel.find({accountNumber: {$in: accounts}}, function (err, journals) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.journalController.translateMongooseArrayToJournalArray(journals));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    findByField(filter: any, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.journalModel.find(filter, function (err, journals) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.journalController.translateMongooseArrayToJournalArray(journals));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    findById(id: string, callback) {
        var self = this;

        var findFunc = (function () {
            //self.onConnectionOpen();

            self.journalModel.findById(id, function (err, journal: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    callback(null, self.journalController.translateMongooseToJournal(journal));
                }
            });

        });

        if (!this.isConnectionOpen) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    save(newJournal: journal.Journal, callback) {
        var self = this;

        var saveFunc = (function () {
            //self.onConnectionOpen();
            let journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            var mongooseJournal = new journalModel();
            self.journalController.translateJournalToMongoose(newJournal, mongooseJournal);

            mongooseJournal.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.journalController.translateMongooseToJournal(result));
                }
            });
        });

        if (!this.isConnectionOpen) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            saveFunc();
        }
    }

    update(id: string, journal: journal.Journal, callback, closeConnection: boolean = false) {
        var self = this;

        var updateFunc = (function () {
            self.journalController.translateJournalToMongoose(journal, self.mongooseJournal);
            self.journalModel.findByIdAndUpdate(self.mongooseJournal._id, self.mongooseJournal, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.journalController.translateMongooseToJournal(result));
                }

            });
        });

        if (!this.isConnectionOpen) {
            this.connection.once("open", updateFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            updateFunc();
        }
    }

    updateAll(journals: any[], callback, closeConnection: boolean = false) {
        var self = this;
        let count = 0;

        async.whilst(() => { return count < journals.length; },
            (callback) => {
                let journalObj: journal.Journal = journals[count];
                count++;

                this.update(journalObj.externalRef, journalObj, function (err, journal) {
                    if (err === null) {
                        console.log("Updated");
                    } else {
                        console.log("Failed to update " + err);
                    }
                    callback();
                }, false);
            },
            (err) => {
                if (closeConnection) {
                    this.cleanUp();
                }
                callback(err, journals);
            });

    }

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}