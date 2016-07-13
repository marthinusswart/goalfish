//import postingServiceLib = require('../../services/posting/posting.service');
import transactionDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
import transactionLib = require('../../models/transaction/transaction');
//import budgetLib = require('../../models/budget/budget');
import { Budget } from '../../models/budget/budget';
import budgetControllerLib = require('../../controllers/budget/budgetController');
import budgetDataAccessLib = require('../../dataaccess/budget/budgetDataAccess');

import async = require('async');

export class BudgetService {
    //postingService: postingServiceLib.PostingService;
    budget: Budget;
    budgetController: budgetControllerLib.BudgetController;
    budgetDataAccess: budgetDataAccessLib.BudgetDataAccess;
    transactionDataAccess: transactionDataAccessLib.TransactionDataAccess;
    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            //this.postingService = new postingServiceLib.PostingService();
            this.budgetController = new budgetControllerLib.BudgetController();
            this.budgetDataAccess = new budgetDataAccessLib.BudgetDataAccess();
            this.transactionDataAccess = new transactionDataAccessLib.TransactionDataAccess();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.wasInitialised = true;
        }
    }

    reconcileBudgets(callback) {
        let self = this;

        this.budgetDataAccess.find(findCallback);

        function findCallback(err, budgets) {
            if (err === null) {
                let count = 0;

                async.whilst(() => { return count < budgets.length; },
                    (callbackWhilst) => {
                        let budget: Budget = budgets[count];
                        count++;
                        budget.isReconciled = false;
                        let filter = { referenceId: budget.id };
                        self.transactionDataAccess.findByField(filter, findTransactionCallback);

                        function findTransactionCallback(err, transactions) {
                            if (err === null) {
                                let balance: number = 0;
                                transactions.forEach((transaction: transactionLib.Transaction) => {
                                    balance += transaction.amount;
                                });
                                budget.calculatedBalance = parseFloat(balance.toFixed(2));;
                                if (budget.balance === budget.calculatedBalance) {
                                    budget.isReconciled = true;
                                }
                            } else {
                                console.log("Error in finding transactions");
                            }

                            callbackWhilst();
                        }
                    },
                    (err) => {
                        callback(err, budgets);
                    });

            } else {
                console.log("Failed to load budgets");
                callback(err, []);
            }


        }

    }
}