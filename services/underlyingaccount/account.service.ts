
import postingServiceLib = require('../../services/posting/posting.service');
import postingDataAccessLib = require('../../dataaccess/posting/postingDataAccess');
import postingLib = require('../../models/posting/posting');
import accountLib = require('../../models/underlyingaccount/underlyingaccount');
import accountControllerLib = require('../../controllers/underlyingaccount/underlyingAccountController');
import accountDataAccessLib = require('../../dataaccess/underlyingaccount/underlyingAccountDataAccess');

import async = require('async');

export class UnderlyingAccountService {
    postingService: postingServiceLib.PostingService;
    underlyingAccount: accountLib.UnderlyingAccount;
    underlyingAccountController: accountControllerLib.UnderlyingAccountController;
    underlyingAccountDataAccess: accountDataAccessLib.UnderlyingAccountDataAccess;
    postingDataAccess: postingDataAccessLib.PostingDataAccess;
    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            this.postingService = new postingServiceLib.PostingService();
            this.underlyingAccountController = new accountControllerLib.UnderlyingAccountController();
            this.underlyingAccountDataAccess = new accountDataAccessLib.UnderlyingAccountDataAccess();
            this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
            this.underlyingAccountDataAccess.init();
            this.postingDataAccess.init();
            this.wasInitialised = true;
        }
    }

    reconcileAccounts(callback) {
        let self = this;

        this.underlyingAccountDataAccess.find(findCallback);

        function findCallback(err, accounts) {
            if (err === null) {
                let count = 0;

                async.whilst(() => { return count < accounts.length; },
                    (callbackWhilst) => {
                        let account: accountLib.UnderlyingAccount = accounts[count];
                        count++;
                        account.isReconciled = false;
                        let filter = { accountNumber: account.id };
                        self.postingDataAccess.findByField(filter, findPostingCallback);

                        function findPostingCallback(err, postings) {
                            if (err === null) {
                                let balance: number = 0;
                                postings.forEach((posting: postingLib.Posting) => {
                                    balance += posting.amount;
                                });
                                account.calculatedBalance = balance;
                                if (account.balance === account.calculatedBalance) {
                                    account.isReconciled = true;
                                }
                            } else {
                                console.log("Error in finding postings");
                            }

                            callbackWhilst();
                        }
                    },
                    (err) => {
                        callback(err, accounts);
                    });

            } else {
                console.log("Failed to load accounts");
                callback(err, []);
            }


        }

    }

}