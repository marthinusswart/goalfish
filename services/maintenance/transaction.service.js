"use strict";
var trxDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
var TransactionMaintenanceService = (function () {
    function TransactionMaintenanceService() {
    }
    TransactionMaintenanceService.prototype.init = function () {
        this.transactionDataAccess = new trxDataAccessLib.TransactionDataAccess();
        this.transactionDataAccess.init();
    };
    TransactionMaintenanceService.prototype.markAllAsPosted = function (callback) {
        var self = this;
        this.transactionDataAccess.find(function (err, transactions) {
            if (err === null) {
                transactions.forEach(function (transaction) {
                    transaction.isPosted = "Y";
                });
                self.transactionDataAccess.updateAll(transactions, function (err, transactions) {
                    callback(err);
                });
            }
            else {
                console.log("Couldn't update: " + err);
                callback(err);
            }
        }, false);
    };
    return TransactionMaintenanceService;
}());
exports.TransactionMaintenanceService = TransactionMaintenanceService;
//# sourceMappingURL=transaction.service.js.map