"use strict";
var mongoose = require('mongoose');
var posting = require('../../models/posting/posting');
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
        postingObj = new posting.Posting();
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
    return PostingController;
}());
exports.PostingController = PostingController;
//# sourceMappingURL=postingController.js.map