"use strict";
var transaction_dataaccess_1 = require('../../dataaccess/transaction/transaction.dataaccess');
var transaction_1 = require('../../models/transaction/transaction');
var initiative_dataaccess_1 = require('../../dataaccess/initiative/initiative.dataaccess');
var journal_1 = require('../../models/journal/journal');
var journal_dataaccess_1 = require('../../dataaccess/journal/journal.dataaccess');
var key_service_1 = require('../key/key.service');
var async = require('async');
var InitativeService = (function () {
    function InitativeService() {
        this.wasInitialised = false;
    }
    InitativeService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.initiativeDataAccess = new initiative_dataaccess_1.InitiativeDataAccess();
            this.transactionDataAccess = new transaction_dataaccess_1.TransactionDataAccess();
            this.journalDataAccess = new journal_dataaccess_1.JournalDataAccess();
            this.keyService = new key_service_1.KeyService();
            this.initiativeDataAccess.init();
            this.transactionDataAccess.init();
            this.journalDataAccess.init();
            this.keyService.init();
            this.wasInitialised = true;
        }
    };
    InitativeService.prototype.reconcileInitiatives = function (memberId, callback) {
        var self = this;
        this.initiativeDataAccess.find(memberId, findCallback);
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
    InitativeService.prototype.deposit = function (memberId, initiativeDeposit, callback) {
        var self = this;
        var transaction = new transaction_1.Transaction();
        var journal = new journal_1.Journal();
        var key;
        var jrnlSaveFunc = function (err, journal) {
            callback(err, { result: "OK" });
        };
        var trxSaveFunc = function (err, transaction) {
            self.journalDataAccess.save(journal, jrnlSaveFunc);
        };
        var journalKeyFunc = function (err, jnlKey) {
            journal.amount = initiativeDeposit.amount * -1;
            journal.accountNumber = initiativeDeposit.fromAccountId;
            journal.date = initiativeDeposit.depositDate;
            journal.memberId = memberId;
            journal.description = initiativeDeposit.description;
            journal.name = "[" + transaction.id + "] Contra on transaction";
            journal.id = journal.createIdFromKey(jnlKey.key);
            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };
        var trxKeyFunc = function (err, trxKey) {
            transaction.amount = initiativeDeposit.amount;
            transaction.classification = "Initiative";
            transaction.date = initiativeDeposit.depositDate;
            transaction.description = initiativeDeposit.description;
            transaction.referenceId = initiativeDeposit.initiativeId;
            transaction.memberId = memberId;
            transaction.underlyingAccount = initiativeDeposit.toAccountId;
            transaction.id = transaction.createIdFromKey(trxKey.key);
            if (initiativeDeposit.fromAccountId !== "-1") {
                self.keyService.getNextKey("journal", journalKeyFunc);
            }
            else {
                self.transactionDataAccess.save(transaction, trxSaveFunc);
            }
        };
        this.keyService.getNextKey("transaction", trxKeyFunc);
    };
    return InitativeService;
}());
exports.InitativeService = InitativeService;
//# sourceMappingURL=initiative.service.js.map