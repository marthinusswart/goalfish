import trxDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
import trxLib = require('../../models/transaction/transaction');

export class TransactionMaintenanceService {
    transactionDataAccess: trxDataAccessLib.TransactionDataAccess;

    init() {
        this.transactionDataAccess = new trxDataAccessLib.TransactionDataAccess();
        this.transactionDataAccess.init();
    }

    markAllAsPosted(callback) {
        var self = this;
        this.transactionDataAccess.find(function (err, transactions) {
            if (err === null) {
                transactions.forEach((transaction: trxLib.Transaction) => {
                    transaction.isPosted = "Y";
                });
                self.transactionDataAccess.updateAll(transactions, function (err, transactions) {
                    callback(err);
                })
            } else {
                console.log("Couldn't update: " + err)
                callback(err);
            }
        }, false);
    }
}