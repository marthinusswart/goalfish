import mongoose = require('mongoose');
import posting = require('../../models/posting/posting');
import postingController = require('../../controllers/posting/postingController');

export class PostingDataAccess {
    connection: mongoose.Connection;
    postingController: postingController.PostingController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.postingController = new postingController.PostingController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");
            postingModel.find({}, function (err, postings) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(postings);
                    callback(null, self.postingController.translateMongooseArrayToPostingArray(postings));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");
            postingModel.findById(id, function (err, posting:mongoose.Schema) {
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
    
    save(newPosting: posting.Posting, callback){
        var self = this;
        this.connection.once("open", function () {

            let postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");            
            var mongoosePosting = new postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);   
                     
            mongoosePosting.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.postingController.translateMongooseToPosting(result));                    
                }
            });

        });
    }
    
     update(id: string, newPosting: posting.Posting, callback){
        var self = this;
        this.connection.once("open", function () {

            let postingSchema = self.postingController.createPostingMongooseSchema();
            var postingModel = self.connection.model("posting", postingSchema, "posting");            
            var mongoosePosting = new postingModel();
            self.postingController.translatePostingToMongoose(newPosting, mongoosePosting);   
                               
            postingModel.findOneAndUpdate({"_id":mongoosePosting._id}, mongoosePosting, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.postingController.translateMongooseToPosting(result));                    
                }
            });

        });
    }
}