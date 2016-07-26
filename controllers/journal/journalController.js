"use strict";
var mongoose = require('mongoose');
var journal_1 = require('../../models/journal/journal');
var JournalController = (function () {
    function JournalController() {
    }
    JournalController.prototype.createJournalMongooseSchema = function () {
        var journalSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            date: Date,
            amount: Number,
            accountNumber: String,
            isPosted: String
        });
        return journalSchema;
    };
    JournalController.prototype.translateJournalToMongoose = function (journal, mongooseJournal) {
        mongooseJournal.id = journal.id;
        mongooseJournal.name = journal.name;
        mongooseJournal.description = journal.description;
        mongooseJournal.amount = journal.amount;
        mongooseJournal.date = journal.date;
        mongooseJournal.isPosted = journal.isPosted;
        mongooseJournal.accountNumber = journal.accountNumber;
        if (journal.externalRef !== "") {
            mongooseJournal._id = journal.externalRef;
        }
        return 0;
    };
    JournalController.prototype.translateMongooseToJournal = function (mongooseJournal) {
        var journalObj;
        journalObj = new journal_1.Journal();
        journalObj.externalRef = mongooseJournal._id;
        journalObj.name = mongooseJournal.name;
        journalObj.description = mongooseJournal.description;
        journalObj.id = mongooseJournal.id;
        journalObj.amount = mongooseJournal.amount;
        journalObj.date = mongooseJournal.date;
        journalObj.isPosted = mongooseJournal.isPosted;
        journalObj.accountNumber = mongooseJournal.accountNumber;
        return journalObj;
    };
    JournalController.prototype.translateMongooseArrayToJournalArray = function (journalSchemaArray) {
        var _this = this;
        var journalArray = [];
        journalSchemaArray.forEach(function (journalSchema) {
            journalArray.push(_this.translateMongooseToJournal(journalSchema));
        });
        return journalArray;
    };
    JournalController.prototype.fromCreditNote = function (creditNote) {
        var journal = new journal_1.Journal();
        journal.accountNumber = creditNote.fromAccount;
        journal.amount = creditNote.amount * -1;
        journal.date = new Date();
        journal.description = creditNote.description;
        journal.name = creditNote.name;
        journal.id = "JNLxxxx";
        return journal;
    };
    return JournalController;
}());
exports.JournalController = JournalController;
//# sourceMappingURL=journalController.js.map