import mongoose = require('mongoose');
import underlyingAccount = require('../../models/underlyingaccount/underlyingAccount');

export class UnderlyingAccountController {

    createUnderlyingAccountMongooseSchema() {
        var UnderlyingAccountSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            productName: String,
            interestRate: Number,
            accountNumber: String,
            holdingInstitution: String,
            balance: Number
        });

        return UnderlyingAccountSchema;
    }

    translateUnderlyingAccountToMongoose(underlyingAccount: underlyingAccount.UnderlyingAccount, mongooseUnderlyingAccount: any) {
        mongooseUnderlyingAccount.id = underlyingAccount.id;
        mongooseUnderlyingAccount.name = underlyingAccount.name;
        mongooseUnderlyingAccount.description = underlyingAccount.description;
        mongooseUnderlyingAccount.productName = underlyingAccount.productName;
        mongooseUnderlyingAccount.interestRate = underlyingAccount.interestRate;
        mongooseUnderlyingAccount.balance = underlyingAccount.balance;
        mongooseUnderlyingAccount.accountNumber = underlyingAccount.accountNumber;
        mongooseUnderlyingAccount.holdingInstitution = underlyingAccount.holdingInstitution;

        if (underlyingAccount.externalRef !== "") {
            mongooseUnderlyingAccount._id = underlyingAccount.externalRef;
        }

        return 0
    }

    translateMongooseToUnderlyingAccount(mongooseUnderlyingAccount: any): underlyingAccount.UnderlyingAccount {
        let underlyingAccountObj: underlyingAccount.UnderlyingAccount;
        underlyingAccountObj = new underlyingAccount.UnderlyingAccount();
        underlyingAccountObj.externalRef = mongooseUnderlyingAccount._id;
        underlyingAccountObj.name = mongooseUnderlyingAccount.name;
        underlyingAccountObj.description = mongooseUnderlyingAccount.description;
        underlyingAccountObj.productName = mongooseUnderlyingAccount.productName;
        underlyingAccountObj.interestRate = mongooseUnderlyingAccount.interestRate;
        underlyingAccountObj.id = mongooseUnderlyingAccount.id;
        underlyingAccountObj.balance = mongooseUnderlyingAccount.balance;
        underlyingAccountObj.accountNumber = mongooseUnderlyingAccount.accountNumber;
        underlyingAccountObj.holdingInstitution = mongooseUnderlyingAccount.holdingInstitution;

        return underlyingAccountObj;
    }

    translateMongooseArrayToUnderlyingAccountArray(underlyingAccountSchemaArray) {
        var underlyingAccountArray = [];
        underlyingAccountSchemaArray.forEach((underlyingAccountSchema: mongoose.Schema) => {
            underlyingAccountArray.push(this.translateMongooseToUnderlyingAccount(underlyingAccountSchema));
        });
        return underlyingAccountArray;
    }

}