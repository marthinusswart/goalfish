"use strict";
//import postingServiceLib = require('../../services/posting/posting.service');
var transactionDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
var budgetControllerLib = require('../../controllers/budget/budgetController');
var budgetDataAccessLib = require('../../dataaccess/budget/budgetDataAccess');
var async = require('async');
var BudgetService = (function () {
    function BudgetService() {
        this.wasInitialised = false;
    }
    BudgetService.prototype.init = function () {
        if (!this.wasInitialised) {
            //this.postingService = new postingServiceLib.PostingService();
            this.budgetController = new budgetControllerLib.BudgetController();
            this.budgetDataAccess = new budgetDataAccessLib.BudgetDataAccess();
            this.transactionDataAccess = new transactionDataAccessLib.TransactionDataAccess();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.wasInitialised = true;
        }
    };
    BudgetService.prototype.reconcileBudgets = function (callback) {
        var self = this;
        this.budgetDataAccess.find(findCallback);
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