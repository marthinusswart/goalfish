import mongoose = require('mongoose');
import postingLib = require('../../models/posting/posting');
import journalLib = require('../../models/journal/journal');

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

    translatePostingToMongoose(posting: postingLib.Posting, mongoosePosting: any) {
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

    translateMongooseToPosting(mongoosePosting: any): postingLib.Posting {
        let postingObj: postingLib.Posting;
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
    }

    translateMongooseArrayToPostingArray(postingSchemaArray) {
        var postingArray = [];
        postingSchemaArray.forEach((postingSchema: mongoose.Schema) => {
            postingArray.push(this.translateMongooseToPosting(postingSchema));
        });
        return postingArray;
    }

    fromJournal(journal: journalLib.Journal): postingLib.Posting {
        let posting: postingLib.Posting = new postingLib.Posting();

        posting.accountNumber = journal.accountNumber;
        posting.amount = journal.amount;
        posting.date = new Date();
        posting.description = journal.description;
        posting.id = "PSTxxxx";
        posting.referenceId = journal.id;
        posting.type = "Journal";
        posting.externalRef = "";

        return posting;
    }

}