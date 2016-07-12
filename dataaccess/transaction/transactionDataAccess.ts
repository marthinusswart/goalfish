import mongoose = require('mongoose');
import transaction = require('../../models/transaction/transaction');
import transactionController = require('../../controllers/transaction/transactionController');
import async = require('async');

export class TransactionDataAccess {
    connection: mongoose.Connection;
    transactionController: transactionController.TransactionController;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;
    transactionSchema: any;
    transactionModel: any;
    mongooseTransaction: any;

    init() {
        if (!this.wasInitialised) {
            var self = this;
            let db = new mongoose.Mongoose();
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.transactionController = new transactionController.TransactionController();

            this.transactionSchema = this.transactionController.createTransactionMongooseSchema();
            this.transactionModel = this.connection.model("transaction", this.transactionSchema, "transaction");
            this.mongooseTransaction = new this.transactionModel();

            this.isConnectionOpening = true;
            this.wasInitialised = true;
            this.connection.on("close", function () {
                self.onConnectionClose();
            });

            this.connection.on("open", function () {
                self.onConnectionOpen();
            });
        } else {
            throw new ReferenceError("Can't initialise again");
        }
    }

    cleanUp() {
        if (this.wasInitialised) {
            this.connection.close();
        }
    }

    find(callback, closeConnection: boolean = false) {
        if (!this.wasInitialised) {
            throw new ReferenceError("Transaction Data Access module was not initialised");
        }

        var self = this;

        var findFunc = (function () {
            self.transactionModel.find({}, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.transactionController.translateMongooseArrayToTransactionArray(transactions));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }

    }

    findByField(filter: any, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.transactionModel.find(filter, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.transactionController.translateMongooseArrayToTransactionArray(transactions));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    findById(id: string, callback, closeConnection: boolean = false) {
        var self = this;

        var findFunc = (function () {

            let transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            transactionModel.findById(id, function (err, transaction: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.transactionController.translateMongooseToTransaction(transaction));
                }
            });
        });

        if (!this.isConnectionOpen) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    save(newTransaction: transaction.Transaction, callback, closeConnection: boolean = false) {
        var self = this;

        var saveFunc = (function () {

            let transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            var mongooseTransaction = new transactionModel();
            self.transactionController.translateTransactionToMongoose(newTransaction, mongooseTransaction);

            mongooseTransaction.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.transactionController.translateMongooseToTransaction(result));
                }
            });

        });

        if (!this.isConnectionOpen) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            saveFunc();
        }
    }

    update(id: string, newTransaction: transaction.Transaction, callback, closeConnection: boolean = false) {
        var self = this;

        var updateFunc = (function () {

            self.transactionController.translateTransactionToMongoose(newTransaction, self.mongooseTransaction);

            self.transactionModel.findByIdAndUpdate(self.mongooseTransaction._id, self.mongooseTransaction, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            updateFunc();
        }
    }

    updateAll(transactions: any[], callback, closeConnection: boolean = false) {
        var self = this;
        let count = 0;

        async.whilst(() => { return count < transactions.length; },
            (callback) => {
                let transactionObj: transaction.Transaction = transactions[count];
                count++;

                this.update(transactionObj.externalRef, transactionObj, function (err, transaction) {
                    if (err === null) {
                    } else {
                        console.log("Failed to update " + err);
                    }
                    callback();
                }, false);
            },
            (err) => {
                if (closeConnection) {
                    this.cleanUp();
                }
                callback(err, transactions);
            });

    }

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}