"use strict";
var mongoose = require('mongoose');
var creditnote_1 = require('../../models/creditnote/creditnote');
var CreditNoteController = (function () {
    function CreditNoteController() {
    }
    CreditNoteController.prototype.createCreditNoteMongooseSchema = function () {
        var crNoteSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            amount: Number,
            fromAccount: String,
            toAccount: String,
            memberId: String,
            date: Date,
            state: String
        });
        return crNoteSchema;
    };
    CreditNoteController.prototype.translateCreditNoteToMongoose = function (crNote, mongooseCrNote) {
        mongooseCrNote.id = crNote.id;
        mongooseCrNote.name = crNote.name;
        mongooseCrNote.description = crNote.description;
        mongooseCrNote.amount = crNote.amount;
        mongooseCrNote.date = crNote.date;
        mongooseCrNote.fromAccount = crNote.fromAccount;
        mongooseCrNote.toAccount = crNote.toAccount;
        mongooseCrNote.memberId = crNote.memberId;
        mongooseCrNote.state = crNote.state;
        if (crNote.externalRef !== "") {
            mongooseCrNote._id = crNote.externalRef;
        }
        return 0;
    };
    CreditNoteController.prototype.translateMongooseToCreditNote = function (mongooseCrNote) {
        var crNoteObj;
        crNoteObj = new creditnote_1.CreditNote();
        crNoteObj.externalRef = mongooseCrNote._id;
        crNoteObj.name = mongooseCrNote.name;
        crNoteObj.description = mongooseCrNote.description;
        crNoteObj.id = mongooseCrNote.id;
        crNoteObj.amount = mongooseCrNote.amount;
        crNoteObj.date = mongooseCrNote.date;
        crNoteObj.fromAccount = mongooseCrNote.fromAccount;
        crNoteObj.toAccount = mongooseCrNote.toAccount;
        crNoteObj.memberId = mongooseCrNote.memberId;
        crNoteObj.state = mongooseCrNote.state;
        return crNoteObj;
    };
    CreditNoteController.prototype.translateMongooseArrayToCreditNoteArray = function (crNoteSchemaArray) {
        var _this = this;
        var crNoteArray = [];
        crNoteSchemaArray.forEach(function (crNoteSchema) {
            crNoteArray.push(_this.translateMongooseToCreditNote(crNoteSchema));
        });
        return crNoteArray;
    };
    return CreditNoteController;
}());
exports.CreditNoteController = CreditNoteController;
//# sourceMappingURL=creditnote.controller.js.map