"use strict";
var transactionDataAccess_1 = require('../../dataaccess/transaction/transactionDataAccess');
var transaction_1 = require('../../models/transaction/transaction');
var budgetDataAccess_1 = require('../../dataaccess/budget/budgetDataAccess');
var journal_1 = require('../../models/journal/journal');
var journalDataAccess_1 = require('../../dataaccess/journal/journalDataAccess');
var key_service_1 = require('../key/key.service');
var async = require('async');
var BudgetService = (function () {
    function BudgetService() {
        this.wasInitialised = false;
    }
    BudgetService.prototype.init = function () {
        if (!this.wasInitialised) {
            //this.budgetController = new BudgetController();
            this.budgetDataAccess = new budgetDataAccess_1.BudgetDataAccess();
            this.transactionDataAccess = new transactionDataAccess_1.TransactionDataAccess();
            this.journalDataAccess = new journalDataAccess_1.JournalDataAccess();
            this.keyService = new key_service_1.KeyService();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.journalDataAccess.init();
            this.keyService.init();
            this.wasInitialised = true;
        }
    };
    BudgetService.prototype.reconcileBudgets = function (memberId, callback) {
        var self = this;
        this.budgetDataAccess.find(memberId, findCallback);
        function findCallback(err, budgets) {
            if (err === null) {
                var count_1 = 0;
                async.whilst(function () { return count_1 < budgets.length; }, function (callbackWhilst) {
                    var budget = budgets[count_1];
                    count_1++;
                    budget.isReconciled = false;
                    var filter = { referenceId: budget.id };
                    self.transactionDataAccess.findByField(filter, findTransactionCallback);
                    function findTransactionCallback(err, transactions) {
                        if (err === null) {
                            var balance_1 = 0;
                            transactions.forEach(function (transaction) {
                                balance_1 += transaction.amount;
                            });
                            budget.calculatedBalance = parseFloat(balance_1.toFixed(2));
                            ;
                            if (budget.balance === budget.calculatedBalance) {
                                budget.isReconciled = true;
                            }
                        }
                        else {
                            console.log("Error in finding transactions");
                        }
                        callbackWhilst();
                    }
                }, function (err) {
                    callback(err, budgets);
                });
            }
            else {
                console.log("Failed to load budgets");
                callback(err, []);
            }
        }
    };
    BudgetService.prototype.deposit = function (memberId, budgetDeposit, callback) {
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
            journal.amount = budgetDeposit.amount * -1;
            journal.accountNumber = budgetDeposit.fromAccountId;
            journal.date = budgetDeposit.depositDate;
            journal.description = budgetDeposit.description;
            journal.name = "Contra on transaction";
            journal.id = journal.createIdFromKey(jnlKey.key);
            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };
        var trxKeyFunc = function (err, trxKey) {
            transaction.amount = budgetDeposit.amount;
            transaction.classification = "Budget";
            transaction.date = budgetDeposit.depositDate;
            transaction.description = budgetDeposit.description;
            transaction.referenceId = budgetDeposit.budgetId;
            transaction.underlyingAccount = budgetDeposit.toAccountId;
            transaction.id = transaction.createIdFromKey(trxKey.key);
            self.keyService.getNextKey("journal", journalKeyFunc);
        };
        this.keyService.getNextKey("transaction", trxKeyFunc);
    };
    return BudgetService;
}());
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map