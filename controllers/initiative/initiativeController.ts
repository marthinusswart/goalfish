import mongoose = require('mongoose');
import initiative = require('../../models/initiative/initiative');

export class InitiativeController {

    createInitiativeMongooseSchema() {
        var initiativeSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            targetBalance: Number,
            targetDate: Date,
            balance: Number,
            underlyingAccount: String,
            instalmentAmount: Number,
            frequency : String,
            memberId: String

        });

        return initiativeSchema;
    }

    translateInitiativeToMongoose(initiative: initiative.Initiative, mongooseInitiative: any) {
        mongooseInitiative.id = initiative.id;
        mongooseInitiative.name = initiative.name;
        mongooseInitiative.description = initiative.description;
        mongooseInitiative.targetBalance = initiative.targetBalance;
        mongooseInitiative.targetDate = initiative.targetDate;
        mongooseInitiative.balance = initiative.balance;
        mongooseInitiative.instalmentAmount = initiative.instalmentAmount;
        mongooseInitiative.frequency = initiative.frequency;
        mongooseInitiative.underlyingAccount = initiative.underlyingAccount;
        mongooseInitiative.memberId = initiative.memberId;

        if (initiative.externalRef !== "") {
            mongooseInitiative._id = initiative.externalRef;
        }

        return 0
    }

    translateMongooseToInitiative(mongooseInitiative: any): initiative.Initiative {
        let initiativeObj: initiative.Initiative;
        initiativeObj = new initiative.Initiative();
        initiativeObj.externalRef = mongooseInitiative._id;
        initiativeObj.name = mongooseInitiative.name;
        initiativeObj.description = mongooseInitiative.description;
        initiativeObj.targetBalance = mongooseInitiative.targetBalance;
        initiativeObj.targetDate = mongooseInitiative.targetDate;
        initiativeObj.id = mongooseInitiative.id;
        initiativeObj.balance = mongooseInitiative.balance;
        initiativeObj.instalmentAmount = mongooseInitiative.instalmentAmount;
        initiativeObj.frequency = mongooseInitiative.frequency;
        initiativeObj.underlyingAccount = mongooseInitiative.underlyingAccount;
        initiativeObj.memberId = mongooseInitiative.memberId;


        return initiativeObj;
    }

    translateMongooseArrayToInitiativeArray(initiativeSchemaArray) {
        var initiativeArray = [];
        initiativeSchemaArray.forEach((initiativeSchema: mongoose.Schema) => {
            initiativeArray.push(this.translateMongooseToInitiative(initiativeSchema));
        });
        return initiativeArray;
    }

}