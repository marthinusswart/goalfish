"use strict";
var transactionDataAccess_1 = require('../../dataaccess/transaction/transactionDataAccess');
var budgetController_1 = require('../../controllers/budget/budgetController');
var budgetDataAccess_1 = require('../../dataaccess/budget/budgetDataAccess');
var async = require('async');
var BudgetService = (function () {
    function BudgetService() {
        this.wasInitialised = false;
    }
    BudgetService.prototype.init = function () {
        if (!this.wasInitialised) {
            //this.postingService = new postingServiceLib.PostingService();
            this.budgetController = new budgetController_1.BudgetController();
            this.budgetDataAccess = new budgetDataAccess_1.BudgetDataAccess();
            this.transactionDataAccess = new transactionDataAccess_1.TransactionDataAccess();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.wasInitialised = true;
        }
    };
    BudgetService.prototype.reconcileBudgets = function (callback) {
        var self = this;
        this.budgetDataAccess.find("MEM0001", findCallback);
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
    return BudgetService;
}());
exports.BudgetService = BudgetService;
//# sourceMappingURL=budget.service.js.map