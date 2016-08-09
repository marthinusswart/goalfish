import mongoose = require('mongoose');
import posting = require('../../models/posting/posting');
import postingController = require('../../controllers/posting/postingController');
import async = require('async');

export class PostingDataAccess {
    connection: mongoose.Connection;
    postingController: postingController.PostingController;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;
    postingSchema: any;
    postingModel: any;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
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
        } else {
            throw new ReferenceError("Can't initialise again");
        }
    }

    cleanUp() {
        if (this.wasInitialised) {
            this.connection.close();
        }
    }

    find(accounts: string[], callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.postingModel.find({accountNumber: {$in: accounts}}, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    findByField(filter: any, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.postingModel.find(filter, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }


    findById(id: string, callback) {
        var self = this;
        var findFunc = (function () {

            self.postingModel.findById(id, function (err, posting: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    callback(null, self.postingController.translateMongooseToPosting(posting));
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

    save(newPosting: posting.Posting, callback, closeConnection: boolean = false) {
        var self = this;
        var saveFunc = (function () {
            let mongoosePosting = new self.postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);

            mongoosePosting.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            saveFunc();
        }
    }

    update(id: string, newPosting: posting.Posting, callback, closeConnection: boolean = false) {
        var self = this;
        var updateFunc = (function () {
            let mongoosePosting = new self.postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);

            self.postingModel.findByIdAndUpdate(mongoosePosting._id, mongoosePosting, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            updateFunc();
        }
    }

    saveAll(postings: any[], callback, closeConnection: boolean = false) {
        var self = this;
        let count = 0;

        async.whilst(() => { return count < postings.length; },
            (callback) => {
                let postingObj: posting.Posting = postings[count];
                count++;

                this.save(postingObj, function (err, posting) {
                    if (err === null) {
                        console.log("Saved " + posting.externalRef)
                    } else {
                        console.log("Failed to save " + err);
                    }
                    callback();
                }, false);
            },
            (err) => {
                if (closeConnection) {
                    this.cleanUp();
                }
                callback(err, postings);
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