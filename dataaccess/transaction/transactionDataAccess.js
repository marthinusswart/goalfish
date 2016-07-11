"use strict";
var mongoose = require('mongoose');
var transactionController = require('../../controllers/transaction/transactionController');
var async = require('async');
var TransactionDataAccess = (function () {
    function TransactionDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
    }
    TransactionDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var self = this;
            var db = new mongoose.Mongoose();
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.transactionController = new transactionController.TransactionController();
            this.transactionSchema = this.transactionController.createTransactionMongooseSchema();
            this.transactionModel = this.connection.model("transaction", this.transactionSchema, "transaction");
            this.mongooseTransaction = new this.transactionModel();
            this.wasInitialised = true;
            this.connection.on("close", function () {
                self.onConnectionClose();
            });
            this.connection.on("open", function () {
                self.onConnectionOpen();
            });
        }
        else {
            throw new ReferenceError("Can't initialise again");
        }
    };
    TransactionDataAccess.prototype.cleanUp = function () {
        if (this.wasInitialised) {
            this.connection.close();
        }
    };
    TransactionDataAccess.prototype.find = function (callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = true; }
        if (!this.wasInitialised) {
            throw new ReferenceError("Transaction Data Access module was not initialised");
        }
        var self = this;
        var findFunc = (function () {
            //self.onConnectionOpen();
            self.transactionModel.find({}, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.transactionController.translateMongooseArrayToTransactionArray(transactions));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    TransactionDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        var findFunc = (function () {
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
        if (!this.isConnectionOpen) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    TransactionDataAccess.prototype.save = function (newTransaction, callback) {
        var self = this;
        var saveFunc = (function () {
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
        if (!this.isConnectionOpen) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            saveFunc();
        }
    };
    TransactionDataAccess.prototype.update = function (id, newTransaction, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = true; }
        var self = this;
        var updateFunc = (function () {
            self.transactionController.translateTransactionToMongoose(newTransaction, self.mongooseTransaction);
            self.transactionModel.findByIdAndUpdate(self.mongooseTransaction._id, self.mongooseTransaction, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.transactionController.translateMongooseToTransaction(result));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", updateFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            updateFunc();
        }
    };
    TransactionDataAccess.prototype.updateAll = function (transactions, callback) {
        var _this = this;
        var self = this;
        var count = 0;
        async.whilst(function () { return count < transactions.length; }, function (callback) {
            var transactionObj = transactions[count];
            count++;
            _this.update(transactionObj.externalRef, transactionObj, function (err, transaction) {
                if (err === null) {
                }
                else {
                    console.log("Failed to update " + err);
                }
                callback();
            }, false);
        }, function (err) {
            _this.cleanUp();
            callback(err, transactions);
        });
    };
    TransactionDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
    };
    TransactionDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return TransactionDataAccess;
}());
exports.TransactionDataAccess = TransactionDataAccess;
//# sourceMappingURL=transactionDataAccess.js.map