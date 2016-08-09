"use strict";
var mongoose = require('mongoose');
var postingController = require('../../controllers/posting/postingController');
var async = require('async');
var PostingDataAccess = (function () {
    function PostingDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
        this.isConnectionOpening = false;
    }
    PostingDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.postingController = new postingController.PostingController();
            this.postingSchema = this.postingController.createPostingMongooseSchema();
            this.postingModel = this.connection.model("posting", this.postingSchema, "posting");
            this.isConnectionOpening = true;
            this.wasInitialised = true;
            this.connection.on("close", function () {
                self.onConnectionClose();
            });
            this.connection.on("open", function () {
                self.onConnectionOpen();
            });
        }
        else {
            throw new ReferenceError("Can't initialise again");
        }
    };
    PostingDataAccess.prototype.cleanUp = function () {
        if (this.wasInitialised) {
            this.connection.close();
        }
    };
    PostingDataAccess.prototype.find = function (accounts, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.postingModel.find({ accountNumber: { $in: accounts } }, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.postingController.translateMongooseArrayToPostingArray(postings));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    PostingDataAccess.prototype.findByField = function (filter, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.postingModel.find(filter, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.postingController.translateMongooseArrayToPostingArray(postings));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    PostingDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        var findFunc = (function () {
            self.postingModel.findById(id, function (err, posting) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    callback(null, self.postingController.translateMongooseToPosting(posting));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    PostingDataAccess.prototype.save = function (newPosting, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            var mongoosePosting = new self.postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);
            mongoosePosting.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.postingController.translateMongooseToPosting(result));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            saveFunc();
        }
    };
    PostingDataAccess.prototype.update = function (id, newPosting, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
            var mongoosePosting = new self.postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);
            self.postingModel.findByIdAndUpdate(mongoosePosting._id, mongoosePosting, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.postingController.translateMongooseToPosting(result));
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
    PostingDataAccess.prototype.saveAll = function (postings, callback, closeConnection) {
        var _this = this;
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var count = 0;
        async.whilst(function () { return count < postings.length; }, function (callback) {
            var postingObj = postings[count];
            count++;
            _this.save(postingObj, function (err, posting) {
                if (err === null) {
                    console.log("Saved " + posting.externalRef);
                }
                else {
                    console.log("Failed to save " + err);
                }
                callback();
            }, false);
        }, function (err) {
            if (closeConnection) {
                _this.cleanUp();
            }
            callback(err, postings);
        });
    };
    PostingDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    PostingDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return PostingDataAccess;
}());
exports.PostingDataAccess = PostingDataAccess;
//# sourceMappingURL=posting.dataaccess.js.map