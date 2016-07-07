import mongoose = require('mongoose');
import journal = require('../../models/journal/journal');

export class JournalController {

    createJournalMongooseSchema() {
        var journalSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            date: Date,
            amount: Number,
            accountNumber: String,
            isPosted : String
        });

        return journalSchema;
    }

    translateJournalToMongoose(journal: journal.Journal, mongooseJournal: any) {
        mongooseJournal.id = journal.id;
        mongooseJournal.name = journal.name;
        mongooseJournal.description = journal.description;
        mongooseJournal.amount = journal.amount;
        mongooseJournal.date = journal.date;
        mongooseJournal.isPosted = journal.isPosted;
        mongooseJournal.accountNumber = journal.accountNumber;

        if (journal.externalRef !== "") {
            mongooseJournal._id = journal.externalRef;
        }

        return 0
    }

    translateMongooseToJournal(mongooseJournal: any): journal.Journal {
        let journalObj: journal.Journal;
        journalObj = new journal.Journal();
        journalObj.externalRef = mongooseJournal._id;
        journalObj.name = mongooseJournal.name;
        journalObj.description = mongooseJournal.description;
        journalObj.id = mongooseJournal.id;
        journalObj.amount = mongooseJournal.amount;
        journalObj.date = mongooseJournal.date;
        journalObj.isPosted = mongooseJournal.isPosted;
        journalObj.accountNumber = mongooseJournal.accountNumber;

        return journalObj;
    }

    translateMongooseArrayToJournalArray(journalSchemaArray) {
        var journalArray = [];
        journalSchemaArray.forEach((journalSchema: mongoose.Schema) => {
            journalArray.push(this.translateMongooseToJournal(journalSchema));
        });
        return journalArray;
    }

}