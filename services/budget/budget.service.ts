import { TransactionDataAccess } from '../../dataaccess/transaction/transactionDataAccess';
import { Transaction } from '../../models/transaction/transaction';
import { Budget } from '../../models/budget/budget';
import { BudgetController } from '../../controllers/budget/budgetController';
import { BudgetDataAccess } from '../../dataaccess/budget/budgetDataAccess';
import async = require('async');

export class BudgetService {
    //postingService: postingServiceLib.PostingService;
    budget: Budget;
    budgetController: BudgetController;
    budgetDataAccess: BudgetDataAccess;
    transactionDataAccess: TransactionDataAccess;
    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            this.budgetController = new BudgetController();
            this.budgetDataAccess = new BudgetDataAccess();
            this.transactionDataAccess = new TransactionDataAccess();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.wasInitialised = true;
        }
    }

    reconcileBudgets(memberId: string, callback) {
        let self = this;

        this.budgetDataAccess.find(memberId, findCallback);

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
                                transactions.forEach((transaction: Transaction) => {
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