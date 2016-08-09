import trxDataAccessLib = require('../../dataaccess/transaction/transaction.dataaccess');
import trxLib = require('../../models/transaction/transaction');

import journalDataAccessLib = require('../../dataaccess/journal/journal.dataaccess');
import journalLib = require('../../models/journal/journal');

import postingDataAccessLib = require('../../dataaccess/posting/posting.dataaccess');
import postingLib = require('../../models/posting/posting');
import postingControllerLib = require('../../controllers/posting/postingController');

import keyServiceLib = require('../key/key.service');
import keyLib = require('../../models/key/key');

import async = require('async');

export class PostingService {
    transactionDataAccess: trxDataAccessLib.TransactionDataAccess;
    journalDataAccess: journalDataAccessLib.JournalDataAccess;
    postingDataAccess: postingDataAccessLib.PostingDataAccess;
    postingController: postingControllerLib.PostingController;
    keyService: keyServiceLib.KeyService;

    processTransactions(callback) {
        this.transactionDataAccess = new trxDataAccessLib.TransactionDataAccess();
        this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
        this.postingController = new postingControllerLib.PostingController();
        this.keyService = new keyServiceLib.KeyService();

        this.transactionDataAccess.init();
        this.postingDataAccess.init();
        this.keyService.init();

        var self = this;
        //let filter = { $and: [{ isPosted: "N" }, {}]};
        let filter = { isPosted: "N" };
        let count = 0;

        this.transactionDataAccess.findByField(filter, function (err, transactions) {
            let postings: postingLib.Posting[] = [];
            if (err === null) {
                transactions.forEach((transaction: trxLib.Transaction) => {
                    transaction.isPosted = "Y";

                    let posting: postingLib.Posting = self.postingController.fromTransaction(transaction);
                    postings.push(posting);

                });

                async.whilst(() => { return count < postings.length; },
                    (callback) => {
                        let postingObj: postingLib.Posting = postings[count];
                        count++;

                        self.keyService.getNextKey("posting", function (err, key: keyLib.Key) {
                            if (err === null) {
                                let keyStr: string = "" + key.key;
                                if (key.key < 1000) {
                                    keyStr = ("0000" + keyStr).slice(-4);
                                }
                                postingObj.id = "PST" + keyStr;
                                console.log("loaded key " + postingObj.id);
                            } else {
                                console.log("Failed to load key " + err);
                            }
                            callback();
                        });
                    },
                    (err) => {
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
                            }],
                            function (err) {
                                callback(err, {result:"OK"});
                            }
                        );

                    });


            } else {
                console.log("Couldn't update: " + err)
                callback(err);
            }
        }, false);
    }

    processJournals(callback) {
        this.journalDataAccess = new journalDataAccessLib.JournalDataAccess();
        this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
        this.postingController = new postingControllerLib.PostingController();
        this.keyService = new keyServiceLib.KeyService();

        this.journalDataAccess.init();
        this.postingDataAccess.init();
        this.keyService.init();

        var self = this;
        let filter = { isPosted: "N" };
        let count = 0;

        this.journalDataAccess.findByField(filter, function (err, journals) {
            let postings: postingLib.Posting[] = [];
            if (err === null) {
                journals.forEach((journal: journalLib.Journal) => {
                    journal.isPosted = "Y";

                    let posting: postingLib.Posting = self.postingController.fromJournal(journal);
                    postings.push(posting);

                });

                async.whilst(() => { return count < postings.length; },
                    (callback) => {
                        let postingObj: postingLib.Posting = postings[count];
                        count++;

                        self.keyService.getNextKey("posting", function (err, key: keyLib.Key) {
                            if (err === null) {
                                let keyStr: string = "" + key.key;
                                if (key.key < 1000) {
                                    keyStr = ("0000" + keyStr).slice(-4);
                                }
                                postingObj.id = "PST" + keyStr;
                                console.log("loaded key " + postingObj.id);
                            } else {
                                console.log("Failed to load key " + err);
                            }
                            callback();
                        });
                    },
                    (err) => {
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
                            }],
                            function (err) {
                                callback(err, {result:"OK"});
                            }
                        );

                    });


            } else {
                console.log("Couldn't update: " + err)
                callback(err);
            }
        }, false);
    }
}