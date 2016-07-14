//import postingServiceLib = require('../../services/posting/posting.service');
import transactionDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
import transactionLib = require('../../models/transaction/transaction');
import initiativeLib = require('../../models/initiative/initiative');
import initiativeControllerLib = require('../../controllers/initiative/initiativeController');
import initiativeDataAccessLib = require('../../dataaccess/initiative/initiativeDataAccess');

import async = require('async');

export class InitativeService {
    //postingService: postingServiceLib.PostingService;
    initiative: initiativeLib.Initiative;
    initiativeController: initiativeControllerLib.InitiativeController;
    initiativeDataAccess: initiativeDataAccessLib.InitiativeDataAccess;
    transactionDataAccess: transactionDataAccessLib.TransactionDataAccess;
    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            //this.postingService = new postingServiceLib.PostingService();
            this.initiativeController = new initiativeControllerLib.InitiativeController();
            this.initiativeDataAccess = new initiativeDataAccessLib.InitiativeDataAccess();
            this.transactionDataAccess = new transactionDataAccessLib.TransactionDataAccess();
            this.initiativeDataAccess.init();
            this.transactionDataAccess.init();
            this.wasInitialised = true;
        }
    }

    reconcileInitiatives(callback) {
        let self = this;

        this.initiativeDataAccess.find("MEM0001", findCallback);

        function findCallback(err, initiatives) {
            if (err === null) {
                let count = 0;

                async.whilst(() => { return count < initiatives.length; },
                    (callbackWhilst) => {
                        let initiative: initiativeLib.Initiative = initiatives[count];
                        count++;
                        initiative.isReconciled = false;
                        let filter = { referenceId: initiative.id };
                        self.transactionDataAccess.findByField(filter, findTransactionCallback);

                        function findTransactionCallback(err, transactions) {
                            if (err === null) {
                                let balance: number = 0;
                                transactions.forEach((transaction: transactionLib.Transaction) => {
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
}