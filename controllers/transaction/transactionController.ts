import mongoose = require('mongoose');
import transaction = require('../../models/transaction/transaction');

export class TransactionController {

    createTransactionMongooseSchema() {
        var transactionSchema = new mongoose.Schema({
               
   externalRef: String,
    id: String,
    referenceId: String,
    classification: String,
    description: String,
    date: Date,
    amount: Number,
    underlyingAccount: String

        });

        return transactionSchema;
    }

    translateTransactionToMongoose(transaction: transaction.Transaction, mongooseTransaction: any) {
        mongooseTransaction.id = transaction.id;
        mongooseTransaction.referenceId = transaction.referenceId;
        mongooseTransaction.description = transaction.description;        
        mongooseTransaction.amount = transaction.amount;
        mongooseTransaction.date = transaction.date;
        mongooseTransaction.classification = transaction.classification;        
        mongooseTransaction.underlyingAccount = transaction.underlyingAccount;

        if (transaction.externalRef !== "") {
            mongooseTransaction._id = transaction.externalRef;
        }

        return 0
    }

    translateMongooseToTransaction(mongooseTransaction: any): transaction.Transaction {
        let transactionObj: transaction.Transaction;
        transactionObj = new transaction.Transaction();
        transactionObj.externalRef = mongooseTransaction._id;
        transactionObj.referenceId = mongooseTransaction.referenceId;
        transactionObj.description = mongooseTransaction.description;        
        transactionObj.id = mongooseTransaction.id;
        transactionObj.amount = mongooseTransaction.amount;
        transactionObj.date = mongooseTransaction.date;
        transactionObj.classification = mongooseTransaction.classification;        
        transactionObj.underlyingAccount = mongooseTransaction.underlyingAccount;

        return transactionObj;
    }

    translateMongooseArrayToTransactionArray(transactionSchemaArray) {
        var transactionArray = [];
        transactionSchemaArray.forEach((transactionSchema: mongoose.Schema) => {
            transactionArray.push(this.translateMongooseToTransaction(transactionSchema));
        });
        return transactionArray;
    }

}