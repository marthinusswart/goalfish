import mongoose = require('mongoose');
import { Journal } from '../../models/journal/journal';
import { CreditNote } from '../../models/creditnote/creditnote';

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
            isPosted: String,
            memberId: String
        });

        return journalSchema;
    }

    translateJournalToMongoose(journal: Journal, mongooseJournal: any) {
        mongooseJournal.id = journal.id;
        mongooseJournal.name = journal.name;
        mongooseJournal.description = journal.description;
        mongooseJournal.amount = journal.amount;
        mongooseJournal.date = journal.date;
        mongooseJournal.isPosted = journal.isPosted;
        mongooseJournal.memberId = journal.memberId;
        mongooseJournal.accountNumber = journal.accountNumber;

        if (journal.externalRef !== "") {
            mongooseJournal._id = journal.externalRef;
        }

        return 0
    }

    translateMongooseToJournal(mongooseJournal: any): Journal {
        let journalObj: Journal;
        journalObj = new Journal();
        journalObj.externalRef = mongooseJournal._id;
        journalObj.name = mongooseJournal.name;
        journalObj.description = mongooseJournal.description;
        journalObj.id = mongooseJournal.id;
        journalObj.amount = mongooseJournal.amount;
        journalObj.date = mongooseJournal.date;
        journalObj.isPosted = mongooseJournal.isPosted;
        journalObj.memberId = mongooseJournal.memberId;
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

    fromCreditNote(creditNote: CreditNote, isDebit: boolean): Journal {
        let journal: Journal = new Journal();

        if (isDebit) {
            journal.accountNumber = creditNote.fromAccount;
            journal.amount = creditNote.amount * -1;
            journal.name = "[CRN Debit] " + creditNote.name;
            journal.description = "[CRN Debit: " + creditNote.id + "] " + creditNote.description;
        } else {
            journal.accountNumber = creditNote.toAccount;
            journal.amount = creditNote.amount;
            journal.name = "[CRN Credit] " + creditNote.name;
            journal.description = "[CRN Credit: " + creditNote.id + "] " + creditNote.description;
        }

        journal.memberId = creditNote.memberId;
        journal.date = new Date();
        journal.id = "JNLxxxx";

        return journal;
    }

}