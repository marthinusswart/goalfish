"use strict";
var posting_dataaccess_1 = require('../../dataaccess/posting/posting.dataaccess');
var underlyingAccountController_1 = require('../../controllers/underlyingaccount/underlyingAccountController');
var underlyingAccount_dataaccess_1 = require('../../dataaccess/underlyingaccount/underlyingAccount.dataaccess');
var async = require('async');
var UnderlyingAccountService = (function () {
    function UnderlyingAccountService() {
        this.wasInitialised = false;
    }
    UnderlyingAccountService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.underlyingAccountController = new underlyingAccountController_1.UnderlyingAccountController();
            this.underlyingAccountDataAccess = new underlyingAccount_dataaccess_1.UnderlyingAccountDataAccess();
            this.postingDataAccess = new posting_dataaccess_1.PostingDataAccess();
            this.underlyingAccountDataAccess.init();
            this.postingDataAccess.init();
            this.wasInitialised = true;
        }
    };
    UnderlyingAccountService.prototype.reconcileAccounts = function (memberId, callback) {
        var self = this;
        this.underlyingAccountDataAccess.find(memberId, findCallback);
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
                            account.calculatedBalance = parseFloat(balance_1.toFixed(2));
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