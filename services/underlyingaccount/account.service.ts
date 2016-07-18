
import { PostingDataAccess } from '../../dataaccess/posting/postingDataAccess';
import {Posting} from '../../models/posting/posting';
import {UnderlyingAccount} from '../../models/underlyingaccount/underlyingaccount';
import {UnderlyingAccountController} from '../../controllers/underlyingaccount/underlyingAccountController';
import {UnderlyingAccountDataAccess} from '../../dataaccess/underlyingaccount/underlyingAccountDataAccess';

import async = require('async');

export class UnderlyingAccountService {
    underlyingAccount: UnderlyingAccount;
    underlyingAccountController: UnderlyingAccountController;
    underlyingAccountDataAccess: UnderlyingAccountDataAccess;
    postingDataAccess: PostingDataAccess;
    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            this.underlyingAccountController = new UnderlyingAccountController();
            this.underlyingAccountDataAccess = new UnderlyingAccountDataAccess();
            this.postingDataAccess = new PostingDataAccess();
            this.underlyingAccountDataAccess.init();
            this.postingDataAccess.init();
            this.wasInitialised = true;
        }
    }

    reconcileAccounts(memberId: string, callback) {
        let self = this;

        this.underlyingAccountDataAccess.find(memberId, findCallback);

        function findCallback(err, accounts) {
            if (err === null) {
                let count = 0;

                async.whilst(() => { return count < accounts.length; },
                    (callbackWhilst) => {
                        let account: UnderlyingAccount = accounts[count];
                        count++;
                        account.isReconciled = false;
                        let filter = { accountNumber: account.id };
                        self.postingDataAccess.findByField(filter, findPostingCallback);

                        function findPostingCallback(err, postings) {
                            if (err === null) {
                                let balance: number = 0;
                                postings.forEach((posting: Posting) => {
                                    balance += posting.amount;
                                });
                                account.calculatedBalance = parseFloat(balance.toFixed(2));
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