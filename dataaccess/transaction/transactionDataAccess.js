"use strict";
var mongoose = require('mongoose');
var transactionController = require('../../controllers/transaction/transactionController');
var PostingDataAccess = (function () {
    function PostingDataAccess() {
    }
    PostingDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.transactionController = new transactionController.TransactionController();
    };
    PostingDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            transactionModel.find({}, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(transactions);
                    callback(null, self.transactionController.translateMongooseArrayToTransactionArray(transactions));
                }
            });
        });
    };
    PostingDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            var transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            transactionModel.findById(id, function (err, transaction) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(transaction);
                    callback(null, self.transactionController.translateMongooseToTransaction(transaction));
                }
            });
        });
    };
    PostingDataAccess.prototype.save = function (newTransaction, callback) {
        var self = this;
        this.connection.once("open", function () {
            var transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            var mongooseTransaction = new transactionModel();
            self.transactionController.translateTransactionToMongoose(newTransaction, mongooseTransaction);
            mongooseTransaction.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.transactionController.translateMongooseToTransaction(result));
                }
            });
        });
    };
    PostingDataAccess.prototype.update = function (id, newTransaction, callback) {
        var self = this;
        this.connection.once("open", function () {
            var transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            var mongooseTransaction = new transactionModel();
            self.transactionController.translateTransactionToMongoose(newTransaction, mongooseTransaction);
            transactionModel.findOneAndUpdate({ "_id": mongooseTransaction._id }, mongooseTransaction, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.transactionController.translateMongooseToTransaction(result));
                }
            });
        });
    };
    return PostingDataAccess;
}());
exports.PostingDataAccess = PostingDataAccess;
//# sourceMappingURL=transactionDataAccess.js.map