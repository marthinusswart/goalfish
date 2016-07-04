import mongoose = require('mongoose');
import posting = require('../../models/posting/posting');

export class PostingController {

    createPostingMongooseSchema() {
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
    }

    translatePostingToMongoose(posting: posting.Posting, mongoosePosting: any) {
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

        return 0
    }

    translateMongooseToPosting(mongoosePosting: any): posting.Posting {
        let postingObj: posting.Posting;
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
    }

    translateMongooseArrayToPostingArray(postingSchemaArray) {
        var postingArray = [];
        postingSchemaArray.forEach((postingSchema: mongoose.Schema) => {
            postingArray.push(this.translateMongooseToPosting(postingSchema));
        });
        return postingArray;
    }

}