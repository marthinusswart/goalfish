import mongoose = require('mongoose');
import posting = require('../../models/posting/posting');
import postingController = require('../../controllers/posting/postingController');

export class PostingDataAccess {
    connection: mongoose.Connection;
    postingController: postingController.PostingController;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;
    postingSchema: any;
    postingModel: any;
    mongoosePosting: any;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.postingController = new postingController.PostingController();
            this.postingSchema = this.postingController.createPostingMongooseSchema();
            this.postingModel = this.connection.model("posting", this.postingSchema, "posting");
            this.mongoosePosting = new this.postingModel();
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

    find(callback) {
        var self = this;
        var findFunc = (function () {

            self.postingModel.find({}, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
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
        this.connection.once("open", function () {

            self.postingModel.findById(id, function (err, posting: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(posting);
                    callback(null, self.postingController.translateMongooseToPosting(posting));
                }
            });

        });
    }

    save(newPosting: posting.Posting, callback, closeConnection: boolean = true) {
        var self = this;
        var saveFunc = (function () {

            self.postingController.translatePostingToMongoose(newPosting, self.mongoosePosting);

            self.mongoosePosting.save(function (err, result) {
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

    update(id: string, newPosting: posting.Posting, callback, closeConnection: boolean = true) {
        var self = this;
        var updateFunc = (function () {

            self.postingController.translatePostingToMongoose(newPosting, self.mongoosePosting);

            self.postingModel.findByIdAndUpdate(self.mongoosePosting._id, self.mongoosePosting, { new: true }, function (err, result) {
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

    saveAll(postings: any[], callback) {
        var self = this;
        let count = 0;

        async.whilst(() => { return count < postings.length; },
            (callback) => {
                let postingObj: posting.Posting = postings[count];
                count++;

                this.save(postingObj, function (err, journal) {
                    if (err === null) {
                    } else {
                        console.log("Failed to save " + err);
                    }
                    callback();
                }, false);
            },
            (err) => {
                this.cleanUp();
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