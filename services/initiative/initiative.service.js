"use strict";
//import postingServiceLib = require('../../services/posting/posting.service');
var transactionDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
var initiativeControllerLib = require('../../controllers/initiative/initiativeController');
var initiativeDataAccessLib = require('../../dataaccess/initiative/initiativeDataAccess');
var async = require('async');
var InitativeService = (function () {
    function InitativeService() {
        this.wasInitialised = false;
    }
    InitativeService.prototype.init = function () {
        if (!this.wasInitialised) {
            //this.postingService = new postingServiceLib.PostingService();
            this.initiativeController = new initiativeControllerLib.InitiativeController();
            this.initiativeDataAccess = new initiativeDataAccessLib.InitiativeDataAccess();
            this.transactionDataAccess = new transactionDataAccessLib.TransactionDataAccess();
            this.initiativeDataAccess.init();
            this.transactionDataAccess.init();
            this.wasInitialised = true;
        }
    };
    InitativeService.prototype.reconcileInitiatives = function (callback) {
        var self = this;
        this.initiativeDataAccess.find("MEM0001", findCallback);
        function findCallback(err, initiatives) {
            if (err === null) {
                var count_1 = 0;
                async.whilst(function () { return count_1 < initiatives.length; }, function (callbackWhilst) {
                    var initiative = initiatives[count_1];
                    count_1++;
                    initiative.isReconciled = false;
                    var filter = { referenceId: initiative.id };
                    self.transactionDataAccess.findByField(filter, findTransactionCallback);
                    function findTransactionCallback(err, transactions) {
                        if (err === null) {
                            var balance_1 = 0;
                            transactions.forEach(function (transaction) {
                                balance_1 += transaction.amount;
                            });
                            initiative.calculatedBalance = parseFloat(balance_1.toFixed(2));
                            ;
                            if (initiative.balance === initiative.calculatedBalance) {
                                initiative.isReconciled = true;
                            }
                        }
                        else {
                            console.log("Error in finding transactions");
                        }
                        callbackWhilst();
                    }
                }, function (err) {
                    callback(err, initiatives);
                });
            }
            else {
                console.log("Failed to load initiatives");
                callback(err, []);
            }
        }
    };
    return InitativeService;
}());
exports.InitativeService = InitativeService;
//# sourceMappingURL=initiative.service.js.map