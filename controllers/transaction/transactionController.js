"use strict";
var mongoose = require('mongoose');
var transaction = require('../../models/transaction/transaction');
var TransactionController = (function () {
    function TransactionController() {
    }
    TransactionController.prototype.createTransactionMongooseSchema = function () {
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
    };
    TransactionController.prototype.translateTransactionToMongoose = function (transaction, mongooseTransaction) {
        mongooseTransaction.id = transaction.id;
        mongooseTransaction.referenceId = transaction.referenceId;
        mongooseTransaction.description = transaction.description;
        mongooseTransaction.amount = transaction.amount;
        mongooseTransaction.date = transaction.date;
        mongooseTransaction.underlyingAccount = transaction.underlyingAccount;
        if (transaction.externalRef !== "") {
            mongooseTransaction._id = transaction.externalRef;
        }
        return 0;
    };
    TransactionController.prototype.translateMongooseToTransaction = function (mongooseTransaction) {
        var transactionObj;
        transactionObj = new transaction.Transaction();
        transactionObj.externalRef = mongooseTransaction._id;
        transactionObj.referenceId = mongooseTransaction.referenceId;
        transactionObj.description = mongooseTransaction.description;
        transactionObj.id = mongooseTransaction.id;
        transactionObj.amount = mongooseTransaction.amount;
        transactionObj.date = mongooseTransaction.date;
        transactionObj.underlyingAccount = mongooseTransaction.underlyingAccount;
        return transactionObj;
    };
    TransactionController.prototype.translateMongooseArrayToTransactionArray = function (transactionSchemaArray) {
        var _this = this;
        var transactionArray = [];
        transactionSchemaArray.forEach(function (transactionSchema) {
            transactionArray.push(_this.translateMongooseToTransaction(transactionSchema));
        });
        return transactionArray;
    };
    return TransactionController;
}());
exports.TransactionController = TransactionController;
//# sourceMappingURL=transactionController.js.map