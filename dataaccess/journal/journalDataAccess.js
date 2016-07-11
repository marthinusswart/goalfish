"use strict";
var mongoose = require('mongoose');
var async = require('async');
var journalController = require('../../controllers/journal/journalController');
var JournalDataAccess = (function () {
    function JournalDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
    }
    JournalDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.journalController = new journalController.JournalController();
            this.journalSchema = this.journalController.createJournalMongooseSchema();
            this.journalModel = this.connection.model("journal", this.journalSchema, "journal");
            this.mongooseJournal = new this.journalModel();
            this.wasInitialised = true;
            this.connection.once("close", function () {
                self.onConnectionClose();
            });
        }
        else {
            throw new ReferenceError("Can't initialise again");
        }
    };
    JournalDataAccess.prototype.cleanUp = function () {
        if (this.wasInitialised) {
            this.connection.close();
        }
    };
    JournalDataAccess.prototype.find = function (callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = true; }
        if (!this.wasInitialised) {
            throw new ReferenceError("Journal Data Access module was not initialised");
        }
        var self = this;
        this.connection.once("open", function () {
            self.onConnectionOpen();
            self.journalModel.find({}, function (err, journals) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.journalController.translateMongooseArrayToJournalArray(journals));
                }
            });
        });
    };
    JournalDataAccess.prototype.findByField = function (field, value, callback) {
        var self = this;
        var filter = field + ":" + value;
        this.connection.once("open", function () {
            self.onConnectionOpen();
            var journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            journalModel.find({ filter: filter }, function (err, journals) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(journals);
                    callback(null, self.journalController.translateMongooseArrayToJournalArray(journals));
                }
            });
        });
    };
    JournalDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            self.onConnectionOpen();
            self.journalModel.findById(id, function (err, journal) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(journal);
                    callback(null, self.journalController.translateMongooseToJournal(journal));
                }
            });
        });
    };
    JournalDataAccess.prototype.save = function (newJournal, callback) {
        var self = this;
        this.connection.once("open", function () {
            self.onConnectionOpen();
            var journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            var mongooseJournal = new journalModel();
            self.journalController.translateJournalToMongoose(newJournal, mongooseJournal);
            mongooseJournal.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.journalController.translateMongooseToJournal(result));
                }
            });
        });
    };
    JournalDataAccess.prototype.update = function (id, journal, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = true; }
        var self = this;
        var updateFunc = (function () {
            self.onConnectionOpen();
            self.journalController.translateJournalToMongoose(journal, self.mongooseJournal);
            self.journalModel.findByIdAndUpdate(self.mongooseJournal._id, self.mongooseJournal, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
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
        }
        else {
            updateFunc();
        }
    };
    JournalDataAccess.prototype.updateAll = function (journals, callback) {
        var _this = this;
        var self = this;
        var count = 0;
        async.whilst(function () { return count < journals.length; }, function (callback) {
            var journalObj = journals[count];
            count++;
            _this.update(journalObj.externalRef, journalObj, function (err, journal) {
                if (err === null) {
                }
                else {
                    console.log("Failed to update " + err);
                }
                callback();
            }, false);
        }, function (err) {
            _this.cleanUp();
            callback(err, journals);
        });
    };
    JournalDataAccess.prototype.onConnectionOpen = function () {
        if (!this.isConnectionOpen) {
            this.isConnectionOpen = true;
        }
    };
    JournalDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return JournalDataAccess;
}());
exports.JournalDataAccess = JournalDataAccess;
//# sourceMappingURL=journalDataAccess.js.map