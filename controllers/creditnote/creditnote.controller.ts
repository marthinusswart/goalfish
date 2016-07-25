import mongoose = require('mongoose');
import { CreditNote } from '../../models/creditnote/creditnote';

export class CreditNoteController {

    createCreditNoteMongooseSchema() {
        var crNoteSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            amount: Number,
            fromAccount: String,
            toAccount: String,
            memberId: String,
            date: Date,
            state: String
        });

        return crNoteSchema;
    }

    translateCreditNoteToMongoose(crNote: CreditNote, mongooseCrNote: any) {
        mongooseCrNote.id = crNote.id;
        mongooseCrNote.name = crNote.name;
        mongooseCrNote.description = crNote.description;
        mongooseCrNote.amount = crNote.amount;
        mongooseCrNote.date = crNote.date;
        mongooseCrNote.fromAccount = crNote.fromAccount;
        mongooseCrNote.toAccount = crNote.toAccount;
        mongooseCrNote.memberId = crNote.memberId;
        mongooseCrNote.state = crNote.state;

        if (crNote.externalRef !== "") {
            mongooseCrNote._id = crNote.externalRef;
        }

        return 0
    }

    translateMongooseToCreditNote(mongooseCrNote: any): CreditNote {
        let crNoteObj: CreditNote;
        crNoteObj = new CreditNote();
        crNoteObj.externalRef = mongooseCrNote._id;
        crNoteObj.name = mongooseCrNote.name;
        crNoteObj.description = mongooseCrNote.description;
        crNoteObj.id = mongooseCrNote.id;
        crNoteObj.amount = mongooseCrNote.amount;
        crNoteObj.date = mongooseCrNote.date;
        crNoteObj.fromAccount = mongooseCrNote.fromAccount;
        crNoteObj.toAccount = mongooseCrNote.toAccount;
        crNoteObj.memberId = mongooseCrNote.memberId;
        crNoteObj.state = mongooseCrNote.state;

        return crNoteObj;
    }

    translateMongooseArrayToCreditNoteArray(crNoteSchemaArray) {
        var crNoteArray = [];
        crNoteSchemaArray.forEach((crNoteSchema: mongoose.Schema) => {
            crNoteArray.push(this.translateMongooseToCreditNote(crNoteSchema));
        });
        return crNoteArray;
    }

}