//import postingServiceLib = require('../../services/posting/posting.service');
import { TransactionDataAccess } from '../../dataaccess/transaction/transactionDataAccess';
import { Transaction } from '../../models/transaction/transaction';
import { Initiative } from '../../models/initiative/initiative';
//import initiativeControllerLib = require('../../controllers/initiative/initiativeController');
import { InitiativeDataAccess } from '../../dataaccess/initiative/initiativeDataAccess';
import { InitiativeDeposit } from '../../models/initiative/initiative.deposit';
import { Journal } from '../../models/journal/journal';
import { JournalDataAccess } from '../../dataaccess/journal/journal.dataAccess';
import { KeyService } from '../key/key.service';
import { Key } from '../../models/key/key';

import async = require('async');

export class InitativeService {
    //postingService: postingServiceLib.PostingService;
    initiative: Initiative;
    //initiativeController: initiativeControllerLib.InitiativeController;
    initiativeDataAccess: InitiativeDataAccess;
    transactionDataAccess: TransactionDataAccess;
    journalDataAccess: JournalDataAccess;
    keyService: KeyService;
    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            //this.postingService = new postingServiceLib.PostingService();
            //this.initiativeController = new initiativeControllerLib.InitiativeController();
            this.initiativeDataAccess = new InitiativeDataAccess();
            this.transactionDataAccess = new TransactionDataAccess();
            this.journalDataAccess = new JournalDataAccess();
            this.keyService = new KeyService();
            this.initiativeDataAccess.init();
            this.transactionDataAccess.init();
            this.journalDataAccess.init();
            this.keyService.init();
            this.wasInitialised = true;
        }
    }

    reconcileInitiatives(memberId: string, callback) {
        let self = this;

        this.initiativeDataAccess.find(memberId, findCallback);

        function findCallback(err, initiatives) {
            if (err === null) {
                let count = 0;

                async.whilst(() => { return count < initiatives.length; },
                    (callbackWhilst) => {
                        let initiative: Initiative = initiatives[count];
                        count++;
                        initiative.isReconciled = false;
                        let filter = { referenceId: initiative.id };
                        self.transactionDataAccess.findByField(filter, findTransactionCallback);

                        function findTransactionCallback(err, transactions) {
                            if (err === null) {
                                let balance: number = 0;
                                transactions.forEach((transaction: Transaction) => {
                                    balance += transaction.amount;
                                });
                                initiative.calculatedBalance = parseFloat(balance.toFixed(2));;
                                if (initiative.balance === initiative.calculatedBalance) {
                                    initiative.isReconciled = true;
                                }
                            } else {
                                console.log("Error in finding transactions");
                            }

                            callbackWhilst();
                        }
                    },
                    (err) => {
                        callback(err, initiatives);
                    });

            } else {
                console.log("Failed to load initiatives");
                callback(err, []);
            }


        }

    }

    deposit(memberId: string, initiativeDeposit: InitiativeDeposit, callback) {
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
            journal.amount = initiativeDeposit.amount * -1;
            journal.accountNumber = initiativeDeposit.fromAccountId;
            journal.date = initiativeDeposit.depositDate;
            journal.description = initiativeDeposit.description;
            journal.name = "Contra on transaction";
            journal.id = journal.createIdFromKey(jnlKey.key);

            self.transactionDataAccess.save(transaction, trxSaveFunc);
        };

        var trxKeyFunc = function (err, trxKey: Key) {

            transaction.amount = initiativeDeposit.amount;
            transaction.classification = "Initiative";
            transaction.date = initiativeDeposit.depositDate;
            transaction.description = initiativeDeposit.description;
            transaction.referenceId = initiativeDeposit.initiativeId;
            transaction.underlyingAccount = initiativeDeposit.toAccountId;
            transaction.id = transaction.createIdFromKey(trxKey.key);

            self.keyService.getNextKey("journal", journalKeyFunc);
        };

        this.keyService.getNextKey("transaction", trxKeyFunc);

    }
}