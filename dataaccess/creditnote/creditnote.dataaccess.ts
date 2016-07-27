import mongoose = require('mongoose');
import { CreditNote } from '../../models/creditnote/creditnote';
import { CreditNoteController } from '../../controllers/creditnote/creditnote.controller';
import async = require('async');

export class CreditNoteDataAccess {
    connection: mongoose.Connection;
    crNoteController: CreditNoteController;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;
    crNoteSchema: any;
    crNoteModel: any;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.crNoteController = new CreditNoteController();
            this.crNoteSchema = this.crNoteController.createCreditNoteMongooseSchema();
            this.crNoteModel = this.connection.model("creditnote", this.crNoteSchema, "creditnote");
            this.isConnectionOpening = true;
            this.wasInitialised = true;
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

    find(memberId: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.crNoteModel.find({ memberId:memberId }, function (err, creditNotes) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseArrayToCreditNoteArray(creditNotes));
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

            self.crNoteModel.find(filter, function (err, creditNotes) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseArrayToCreditNoteArray(creditNotes));
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

    findById(id: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.crNoteModel.findById(id, function (err, creditNote: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(creditNote);
                    callback(null, self.crNoteController.translateMongooseToCreditNote(creditNote));
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

    save(newCreditNote: CreditNote, callback, closeConnection: boolean = false) {
        var self = this;
        var saveFunc = (function () {

            var mongooseCrNote = new self.crNoteModel();
            self.crNoteController.translateCreditNoteToMongoose(newCreditNote, mongooseCrNote);

            mongooseCrNote.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseToCreditNote(result));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            saveFunc();
        }
    }

    update(id: string, newCreditNote: CreditNote, callback, closeConnection: boolean = false) {
        var self = this;
        var updateFunc = (function () {

            var mongooseCrNote = new self.crNoteModel();
            self.crNoteController.translateCreditNoteToMongoose(newCreditNote, mongooseCrNote);

            self.crNoteModel.findOneAndUpdate({ "_id": mongooseCrNote._id }, mongooseCrNote, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseToCreditNote(result));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", updateFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            updateFunc();
        }
    }

     updateAll(creditNotes: any[], callback, closeConnection: boolean = false) {
        var self = this;
        let count = 0;

        async.whilst(() => { return count < creditNotes.length; },
            (callback) => {
                let crNoteObj: CreditNote = creditNotes[count];
                count++;

                this.update(crNoteObj.externalRef, crNoteObj, function (err, journal) {
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
                   this.connection.close();
                }
                callback(err, creditNotes);
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