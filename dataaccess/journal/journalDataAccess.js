"use strict";
var mongoose = require('mongoose');
var journalController = require('../../controllers/journal/journalController');
var JournalDataAccess = (function () {
    function JournalDataAccess() {
    }
    JournalDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.journalController = new journalController.JournalController();
    };
    JournalDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            journalModel.find({}, function (err, journals) {
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
            var journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            journalModel.findById(id, function (err, journal) {
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
    JournalDataAccess.prototype.update = function (id, newJournal, callback) {
        var self = this;
        this.connection.once("open", function () {
            var journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            var mongooseJournal = new journalModel();
            self.journalController.translateJournalToMongoose(newJournal, mongooseJournal);
            journalModel.findOneAndUpdate({ "_id": mongooseJournal._id }, mongooseJournal, { new: true }, function (err, result) {
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
    return JournalDataAccess;
}());
exports.JournalDataAccess = JournalDataAccess;
//# sourceMappingURL=journalDataAccess.js.map