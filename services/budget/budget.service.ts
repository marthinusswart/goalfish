import { TransactionDataAccess } from '../../dataaccess/transaction/transaction.dataaccess';
import { Transaction } from '../../models/transaction/transaction';
import { Budget } from '../../models/budget/budget';
import { BudgetDeposit } from '../../models/budget/budget.deposit';
import { BudgetWithdrawal } from '../../models/budget/budget.withdrawal';
import { BudgetDataAccess } from '../../dataaccess/budget/budget.dataaccess';
import { Journal } from '../../models/journal/journal';
import { JournalDataAccess } from '../../dataaccess/journal/journal.dataAccess';
import { KeyService } from '../key/key.service';
import { Key } from '../../models/key/key';
import { CreditNote } from '../../models/creditnote/creditnote';
import { CreditNoteDataAccess } from '../../dataaccess/creditnote/creditnote.dataaccess';
import async = require('async');

export class BudgetService {
    budget: Budget;
    budgetDataAccess: BudgetDataAccess;
    transactionDataAccess: TransactionDataAccess;
    journalDataAccess: JournalDataAccess;
    creditNoteDataAccess: CreditNoteDataAccess;
    keyService: KeyService;

    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            this.budgetDataAccess = new BudgetDataAccess();
            this.transactionDataAccess = new TransactionDataAccess();
            this.journalDataAccess = new JournalDataAccess();
            this.keyService = new KeyService();
            this.creditNoteDataAccess = new CreditNoteDataAccess();
            this.budgetDataAccess.init();
            this.transactionDataAccess.init();
            this.journalDataAccess.init();
            this.keyService.init();
            this.creditNoteDataAccess.init();
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
            journal.memberId = memberId;
            journal.description = budgetDeposit.description;
            journal.name = "[" + transaction.id + "] Contra on transaction";
            journal.id = journal.createIdFromKey(jnlKey.key);

            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };

        var trxKeyFunc = function (err, trxKey: Key) {

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
            } else {
                self.transactionDataAccess.save(transaction, trxSaveFunc);
            }
        };

        this.keyService.getNextKey("transaction", trxKeyFunc);

    }

    withdraw(memberId: string, budgetWithdrawal: BudgetWithdrawal, callback) {
        let self = this;
        let transaction = new Transaction();
        let creditnote = new CreditNote();
        let budget: Budget;
        let key: number;
        let filter = { id: budgetWithdrawal.budgetId };

        var trxSaveFunc = function (err, transaction) {
            callback(err, { result: "OK" });
        };

        var trxKeyFunc = function (err, trxKey: Key) {

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
        }

        var crnKeyFunc = function (err, crnKey: Key) {
            creditnote.amount = budgetWithdrawal.amount;
            creditnote.date = budgetWithdrawal.withdrawalDate;
            creditnote.description = budgetWithdrawal.description;
            creditnote.fromAccount = budget.underlyingAccount;
            creditnote.id = creditnote.createIdFromKey(crnKey.key);
            creditnote.memberId = budget.memberId;
            creditnote.name = "Credit Note";
            creditnote.toAccount = budgetWithdrawal.fromAccountId;

            self.creditNoteDataAccess.save(creditnote, crnSaveFunc);
        }

        var loadBudgetFunc = function (err, budgets) {
            budget = budgets[0];

            if (budget.underlyingAccount !== budgetWithdrawal.fromAccountId) {
                self.keyService.getNextKey("creditnote", crnKeyFunc);
            } else {
                self.keyService.getNextKey("transaction", trxKeyFunc);
            }
        }


        this.budgetDataAccess.findByField(filter, loadBudgetFunc);

    }
}