import { TransactionDataAccess } from '../../dataaccess/transaction/transactionDataAccess';
import { Transaction } from '../../models/transaction/transaction';
import { Budget } from '../../models/budget/budget';
import { BudgetDeposit } from '../../models/budget/budget.deposit';
import { BudgetWithdrawal } from '../../models/budget/budget.withdrawal';
import { BudgetDataAccess } from '../../dataaccess/budget/budget.dataaccess';
import { Journal } from '../../models/journal/journal';
import { JournalDataAccess } from '../../dataaccess/journal/journal.dataAccess';
import { KeyService } from '../key/key.service';
import { Key } from '../../models/key/key';
import async = require('async');

export class BudgetService {
    //postingService: postingServiceLib.PostingService;
    budget: Budget;
    //budgetController: BudgetController;
    budgetDataAccess: BudgetDataAccess;
    transactionDataAccess: TransactionDataAccess;
    journalDataAccess: JournalDataAccess;
    keyService: KeyService;

    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            //this.budgetController = new BudgetController();
            this.budgetDataAccess = new BudgetDataAccess();
            this.transactionDataAccess = new TransactionDataAccess();
            this.journalDataAccess = new JournalDataAccess();
            this.keyService = new KeyService();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.journalDataAccess.init();
            this.keyService.init();
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

    deposit(memberId: string, budgetDeposit: BudgetDeposit, callback) {
        let self = this;
        let transaction = new Transaction();
        let journal = new Journal();
        let key: number;

        var jrnlSaveFunc = function (err, journal) {
            callback(err, { result: "OK" })
        };

        var trxSaveFunc = function (err, transaction) {
            self.journalDataAccess.save(journal, jrnlSaveFunc);
        };

        var journalKeyFunc = function (err, jnlKey: Key) {
            journal.amount = budgetDeposit.amount * -1;
            journal.accountNumber = budgetDeposit.fromAccountId;
            journal.date = budgetDeposit.depositDate;
            journal.description = budgetDeposit.description;
            journal.name = "Contra on transaction";
            journal.id = journal.createIdFromKey(jnlKey.key);

            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };

        var trxKeyFunc = function (err, trxKey: Key) {

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

    }

     withdraw(memberId: string, budgetWithdrawal: BudgetWithdrawal, callback) {
        let self = this;
        let transaction = new Transaction();
        let key: number;

        var trxSaveFunc = function (err, transaction) {
           callback(err, { result: "OK" });
        };

        var trxKeyFunc = function (err, trxKey: Key) {

            transaction.amount = budgetWithdrawal.amount*-1;
            transaction.classification = "Budget";
            transaction.date = budgetWithdrawal.withdrawalDate;
            transaction.description = budgetWithdrawal.description;
            transaction.referenceId = budgetWithdrawal.budgetId;
            transaction.underlyingAccount = budgetWithdrawal.fromAccountId;
            transaction.id = transaction.createIdFromKey(trxKey.key);

            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };

        this.keyService.getNextKey("transaction", trxKeyFunc);

    }
}