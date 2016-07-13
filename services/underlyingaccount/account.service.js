"use strict";
var postingServiceLib = require('../../services/posting/posting.service');
var postingDataAccessLib = require('../../dataaccess/posting/postingDataAccess');
var accountControllerLib = require('../../controllers/underlyingaccount/underlyingAccountController');
var accountDataAccessLib = require('../../dataaccess/underlyingaccount/underlyingAccountDataAccess');
var async = require('async');
var UnderlyingAccountService = (function () {
    function UnderlyingAccountService() {
        this.wasInitialised = false;
    }
    UnderlyingAccountService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.postingService = new postingServiceLib.PostingService();
            this.underlyingAccountController = new accountControllerLib.UnderlyingAccountController();
            this.underlyingAccountDataAccess = new accountDataAccessLib.UnderlyingAccountDataAccess();
            this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
            this.underlyingAccountDataAccess.init();
            this.postingDataAccess.init();
            this.wasInitialised = true;
        }
    };
    UnderlyingAccountService.prototype.reconcileAccounts = function (callback) {
        var self = this;
        this.underlyingAccountDataAccess.find(findCallback);
        function findCallback(err, accounts) {
            if (err === null) {
                var count_1 = 0;
                async.whilst(function () { return count_1 < accounts.length; }, function (callbackWhilst) {
                    var account = accounts[count_1];
                    count_1++;
                    account.isReconciled = false;
                    var filter = { accountNumber: account.id };
                    self.postingDataAccess.findByField(filter, findPostingCallback);
                    function findPostingCallback(err, postings) {
                        if (err === null) {
                            var balance_1 = 0;
                            postings.forEach(function (posting) {
                                balance_1 += posting.amount;
                            });
                            account.calculatedBalance = balance_1;
                            if (account.balance === account.calculatedBalance) {
                                account.isReconciled = true;
                            }
                        }
                        else {
                            console.log("Error in finding postings");
                        }
                        callbackWhilst();
                    }
                }, function (err) {
                    callback(err, accounts);
                });
            }
            else {
                console.log("Failed to load accounts");
                callback(err, []);
            }
        }
    };
    return UnderlyingAccountService;
}());
exports.UnderlyingAccountService = UnderlyingAccountService;
//# sourceMappingURL=account.service.js.map