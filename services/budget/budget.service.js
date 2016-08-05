"use strict";
var transaction_dataaccess_1 = require('../../dataaccess/transaction/transaction.dataaccess');
var transaction_1 = require('../../models/transaction/transaction');
var budget_dataaccess_1 = require('../../dataaccess/budget/budget.dataaccess');
var journal_1 = require('../../models/journal/journal');
var journal_dataAccess_1 = require('../../dataaccess/journal/journal.dataAccess');
var key_service_1 = require('../key/key.service');
var creditnote_1 = require('../../models/creditnote/creditnote');
var creditnote_dataaccess_1 = require('../../dataaccess/creditnote/creditnote.dataaccess');
var async = require('async');
var BudgetService = (function () {
    function BudgetService() {
        this.wasInitialised = false;
    }
    BudgetService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.budgetDataAccess = new budget_dataaccess_1.BudgetDataAccess();
            this.transactionDataAccess = new transaction_dataaccess_1.TransactionDataAccess();
            this.journalDataAccess = new journal_dataAccess_1.JournalDataAccess();
            this.keyService = new key_service_1.KeyService();
            this.creditNoteDataAccess = new creditnote_dataaccess_1.CreditNoteDataAccess();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.journalDataAccess.init();
            this.keyService.init();
            this.creditNoteDataAccess.init();
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
            journal.memberId = memberId;
            journal.description = budgetDeposit.description;
            journal.name = "[" + transaction.id + "] Contra on transaction";
            journal.id = journal.createIdFromKey(jnlKey.key);
            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };
        var trxKeyFunc = function (err, trxKey) {
            transaction.amount = budgetDeposit.amount;
            transaction.classification = "Budget";
            transaction.date = budgetDeposit.depositDate;
            transaction.description = budgetDeposit.description;
            transaction.memberId = memberId;
            transaction.referenceId = budgetDeposit.budgetId;
            transaction.underlyingAccount = budgetDeposit.toAccountId;
            transaction.id = transaction.createIdFromKey(trxKey.key);
            if (budgetDeposit.fromAccountId !== "-1") {
                self.keyService.getNextKey("journal", journalKeyFunc);
            }
            else {
                self.transactionDataAccess.save(transaction, trxSaveFunc);
            }
        };
        this.keyService.getNextKey("transaction", trxKeyFunc);
    };
    BudgetService.prototype.withdraw = function (memberId, budgetWithdrawal, callback) {
        var self = this;
        var transaction = new transaction_1.Transaction();
        var creditnote = new creditnote_1.CreditNote();
        var budget;
        var key;
        var filter = { id: budgetWithdrawal.budgetId };
        var trxSaveFunc = function (err, transaction) {
            callback(err, { result: "OK" });
        };
        var trxKeyFunc = function (err, trxKey) {
            transaction.amount = budgetWithdrawal.amount * -1;
            transaction.classification = "Budget";
            transaction.date = budgetWithdrawal.withdrawalDate;
            transaction.memberId = memberId;
            transaction.description = budgetWithdrawal.description;
            transaction.referenceId = budgetWithdrawal.budgetId;
            transaction.underlyingAccount = budgetWithdrawal.fromAccountId;
            transaction.id = transaction.createIdFromKey(trxKey.key);
            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };
        var crnSaveFunc = function (err, creditNote) {
            self.keyService.getNextKey("transaction", trxKeyFunc);
        };
        var crnKeyFunc = function (err, crnKey) {
            creditnote.amount = budgetWithdrawal.amount;
            creditnote.date = budgetWithdrawal.withdrawalDate;
            creditnote.description = budgetWithdrawal.description;
            creditnote.fromAccount = budget.underlyingAccount;
            creditnote.id = creditnote.createIdFromKey(crnKey.key);
            creditnote.memberId = budget.memberId;
            creditnote.name = "Credit Note";
            creditnote.toAccount = budgetWithdrawal.fromAccountId;
            self.creditNoteDataAccess.save(creditnote, crnSaveFunc);
        };
        var loadBudgetFunc = function (err, budgets) {
            budget = budgets[0];
            if (budget.underlyingAccount !== budgetWithdrawal.fromAccountId) {
                self.keyService.getNextKey("creditnote", crnKeyFunc);
            }
            else {
                self.keyService.getNextKey("transaction", trxKeyFunc);
            }
        };
        this.budgetDataAccess.findByField(filter, loadBudgetFunc);
    };
    return BudgetService;
}());
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map