import mongoose = require('mongoose');
import { CreditNote } from '../../models/creditnote/creditnote';

export class CreditNoteController {

    createCreditNoteMongooseSchema() {
        var crNoteSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            balance: Number,
            underlyingAccount: String,
            memberId: String,
            date: Date
        });

        return crNoteSchema;
    }

    translateCreditNoteToMongoose(crNote: CreditNote, mongooseCrNote: any) {
        mongooseCrNote.id = crNote.id;
        mongooseCrNote.name = crNote.name;
        mongooseCrNote.description = crNote.description;
        mongooseCrNote.balance = crNote.balance;
        mongooseCrNote.date = crNote.date;
        mongooseCrNote.underlyingAccount = crNote.underlyingAccount;
        mongooseCrNote.memberId = crNote.memberId;

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
        crNoteObj.balance = mongooseCrNote.balance;
        crNoteObj.date = mongooseCrNote.date;
        crNoteObj.underlyingAccount = mongooseCrNote.underlyingAccount;
        crNoteObj.memberId = mongooseCrNote.memberId;

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