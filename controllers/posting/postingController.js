"use strict";
var mongoose = require('mongoose');
var postingLib = require('../../models/posting/posting');
var PostingController = (function () {
    function PostingController() {
    }
    PostingController.prototype.createPostingMongooseSchema = function () {
        var postingSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            referenceId: String,
            type: String,
            description: String,
            date: Date,
            amount: Number,
            accountNumber: String
        });
        return postingSchema;
    };
    PostingController.prototype.translatePostingToMongoose = function (posting, mongoosePosting) {
        mongoosePosting.id = posting.id;
        mongoosePosting.referenceId = posting.referenceId;
        mongoosePosting.description = posting.description;
        mongoosePosting.amount = posting.amount;
        mongoosePosting.date = posting.date;
        mongoosePosting.type = posting.type;
        mongoosePosting.accountNumber = posting.accountNumber;
        if (posting.externalRef !== "") {
            mongoosePosting._id = posting.externalRef;
        }
        return 0;
    };
    PostingController.prototype.translateMongooseToPosting = function (mongoosePosting) {
        var postingObj;
        postingObj = new postingLib.Posting();
        postingObj.externalRef = mongoosePosting._id;
        postingObj.referenceId = mongoosePosting.referenceId;
        postingObj.description = mongoosePosting.description;
        postingObj.id = mongoosePosting.id;
        postingObj.amount = mongoosePosting.amount;
        postingObj.date = mongoosePosting.date;
        postingObj.type = mongoosePosting.type;
        postingObj.accountNumber = mongoosePosting.accountNumber;
        return postingObj;
    };
    PostingController.prototype.translateMongooseArrayToPostingArray = function (postingSchemaArray) {
        var _this = this;
        var postingArray = [];
        postingSchemaArray.forEach(function (postingSchema) {
            postingArray.push(_this.translateMongooseToPosting(postingSchema));
        });
        return postingArray;
    };
    PostingController.prototype.fromJournal = function (journal) {
        var posting = new postingLib.Posting();
        posting.accountNumber = journal.accountNumber;
        posting.amount = journal.amount;
        posting.date = new Date();
        posting.description = journal.description;
        posting.id = "PSTxxxx";
        posting.referenceId = journal.id;
        posting.type = "Journal";
        posting.externalRef = "";
        return posting;
    };
    PostingController.prototype.fromTransaction = function (transaction) {
        var posting = new postingLib.Posting();
        posting.accountNumber = transaction.underlyingAccount;
        posting.amount = transaction.amount;
        posting.date = new Date();
        posting.description = transaction.description;
        posting.id = "PSTxxxx";
        posting.referenceId = transaction.id;
        posting.type = "Transaction";
        posting.externalRef = "";
        return posting;
    };
    return PostingController;
}());
exports.PostingController = PostingController;
//# sourceMappingURL=postingController.js.map