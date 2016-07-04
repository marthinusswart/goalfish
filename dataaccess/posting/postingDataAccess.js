"use strict";
var mongoose = require('mongoose');
var postingController = require('../../controllers/posting/postingController');
var PostingDataAccess = (function () {
    function PostingDataAccess() {
    }
    PostingDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.postingController = new postingController.PostingController();
    };
    PostingDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");
            postingModel.find({}, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(postings);
                    callback(null, self.postingController.translateMongooseArrayToPostingArray(postings));
                }
            });
        });
    };
    PostingDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            var postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");
            postingModel.findById(id, function (err, posting) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(posting);
                    callback(null, self.postingController.translateMongooseToPosting(posting));
                }
            });
        });
    };
    PostingDataAccess.prototype.save = function (newPosting, callback) {
        var self = this;
        this.connection.once("open", function () {
            var postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");
            var mongoosePosting = new postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);
            mongoosePosting.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.postingController.translateMongooseToPosting(result));
                }
            });
        });
    };
    PostingDataAccess.prototype.update = function (id, newPosting, callback) {
        var self = this;
        this.connection.once("open", function () {
            var postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");
            var mongoosePosting = new postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);
            postingModel.findOneAndUpdate({ "_id": mongoosePosting._id }, mongoosePosting, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.postingController.translateMongooseToPosting(result));
                }
            });
        });
    };
    return PostingDataAccess;
}());
exports.PostingDataAccess = PostingDataAccess;
//# sourceMappingURL=postingDataAccess.js.map