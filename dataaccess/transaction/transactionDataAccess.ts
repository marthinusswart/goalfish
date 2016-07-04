import mongoose = require('mongoose');
import transaction = require('../../models/transaction/transaction');
import transactionController = require('../../controllers/transaction/transactionController');

export class TransactionDataAccess {
    connection: mongoose.Connection;
    transactionController: transactionController.TransactionController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.transactionController = new transactionController.TransactionController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            transactionModel.find({}, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(transactions);
                    callback(null, self.transactionController.translateMongooseArrayToTransactionArray(transactions));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");
            transactionModel.findById(id, function (err, transaction:mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(transaction);
                    callback(null, self.transactionController.translateMongooseToTransaction(transaction));
                }
            });

        });
    }
    
    save(newTransaction: transaction.Transaction, callback){
        var self = this;
        this.connection.once("open", function () {

            let transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");            
            var mongooseTransaction = new transactionModel();
            self.transactionController.translateTransactionToMongoose(newTransaction, mongooseTransaction);   
                     
            mongooseTransaction.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.transactionController.translateMongooseToTransaction(result));                    
                }
            });

        });
    }
    
     update(id: string, newTransaction: transaction.Transaction, callback){
        var self = this;
        this.connection.once("open", function () {

            let transactionSchema = self.transactionController.createTransactionMongooseSchema();
            var transactionModel = self.connection.model("transaction", transactionSchema, "transaction");            
            var mongooseTransaction = new transactionModel();
            self.transactionController.translateTransactionToMongoose(newTransaction, mongooseTransaction);   
                               
            transactionModel.findOneAndUpdate({"_id":mongooseTransaction._id}, mongooseTransaction, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.transactionController.translateMongooseToTransaction(result));                    
                }
            });

        });
    }
}