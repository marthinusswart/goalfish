"use strict";
var trxDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
var journalDataAccessLib = require('../../dataaccess/journal/journal.dataAccess');
var postingDataAccessLib = require('../../dataaccess/posting/postingDataAccess');
var postingControllerLib = require('../../controllers/posting/postingController');
var keyServiceLib = require('../key/key.service');
var async = require('async');
var PostingService = (function () {
    function PostingService() {
    }
    PostingService.prototype.processTransactions = function (callback) {
        this.transactionDataAccess = new trxDataAccessLib.TransactionDataAccess();
        this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
        this.postingController = new postingControllerLib.PostingController();
        this.keyService = new keyServiceLib.KeyService();
        this.transactionDataAccess.init();
        this.postingDataAccess.init();
        this.keyService.init();
        var self = this;
        var filter = { isPosted: "N" };
        var count = 0;
        this.transactionDataAccess.findByField(filter, function (err, transactions) {
            var postings = [];
            if (err === null) {
                transactions.forEach(function (transaction) {
                    transaction.isPosted = "Y";
                    var posting = self.postingController.fromTransaction(transaction);
                    postings.push(posting);
                });
                async.whilst(function () { return count < postings.length; }, function (callback) {
                    var postingObj = postings[count];
                    count++;
                    self.keyService.getNextKey("posting", function (err, key) {
                        if (err === null) {
                            var keyStr = "" + key.key;
                            if (key.key < 1000) {
                                keyStr = ("0000" + keyStr).slice(-4);
                            }
                            postingObj.id = "PST" + keyStr;
                            console.log("loaded key " + postingObj.id);
                        }
                        else {
                            console.log("Failed to load key " + err);
                        }
                        callback();
                    });
                }, function (err) {
                    async.waterfall([
                        function (callbackWf) {
                            self.transactionDataAccess.updateAll(transactions, function (err, transactions) {
                                callbackWf(err);
                            });
                        },
                        function (callbackWf) {
                            self.postingDataAccess.saveAll(postings, function (err, postings) {
                                callbackWf(err);
                            });
                        }], function (err) {
                        callback(err, { result: "OK" });
                    });
                });
            }
            else {
                console.log("Couldn't update: " + err);
                callback(err);
            }
        }, false);
    };
    PostingService.prototype.processJournals = function (callback) {
        this.journalDataAccess = new journalDataAccessLib.JournalDataAccess();
        this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
        this.postingController = new postingControllerLib.PostingController();
        this.keyService = new keyServiceLib.KeyService();
        this.journalDataAccess.init();
        this.postingDataAccess.init();
        this.keyService.init();
        var self = this;
        var filter = { isPosted: "N" };
        var count = 0;
        this.journalDataAccess.findByField(filter, function (err, journals) {
            var postings = [];
            if (err === null) {
                journals.forEach(function (journal) {
                    journal.isPosted = "Y";
                    var posting = self.postingController.fromJournal(journal);
                    postings.push(posting);
                });
                async.whilst(function () { return count < postings.length; }, function (callback) {
                    var postingObj = postings[count];
                    count++;
                    self.keyService.getNextKey("posting", function (err, key) {
                        if (err === null) {
                            var keyStr = "" + key.key;
                            if (key.key < 1000) {
                                keyStr = ("0000" + keyStr).slice(-4);
                            }
                            postingObj.id = "PST" + keyStr;
                            console.log("loaded key " + postingObj.id);
                        }
                        else {
                            console.log("Failed to load key " + err);
                        }
                        callback();
                    });
                }, function (err) {
                    async.waterfall([
                        function (callbackWf) {
                            self.journalDataAccess.updateAll(journals, function (err, journals) {
                                callbackWf(err);
                            });
                        },
                        function (callbackWf) {
                            self.postingDataAccess.saveAll(postings, function (err, postings) {
                                callbackWf(err);
                            });
                        }], function (err) {
                        callback(err, { result: "OK" });
                    });
                });
            }
            else {
                console.log("Couldn't update: " + err);
                callback(err);
            }
        }, false);
    };
    return PostingService;
}());
exports.PostingService = PostingService;
//# sourceMappingURL=posting.service.js.map