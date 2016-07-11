import trxDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
import trxLib = require('../../models/transaction/transaction');

import journalDataAccessLib = require('../../dataaccess/journal/journalDataAccess');
import journalLib = require('../../models/journal/journal');

import postingDataAccessLib = require('../../dataaccess/posting/postingDataAccess');
import postingLib = require('../../models/posting/posting');
import postingControllerLib = require('../../controllers/posting/postingController');

import async = require('async');

export class PostingService {
    transactionDataAccess: trxDataAccessLib.TransactionDataAccess;
    journalDataAccess: journalDataAccessLib.JournalDataAccess;
    postingDataAccess: postingDataAccessLib.PostingDataAccess;
    postingController: postingControllerLib.PostingController;

    processTransactions(callback) {
        this.transactionDataAccess = new trxDataAccessLib.TransactionDataAccess();
        this.transactionDataAccess.init();
        var self = this;
        //this.transactionDataAccess.findByField()
    }

    processJournals(callback) {
        this.journalDataAccess = new journalDataAccessLib.JournalDataAccess();
        this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
        this.postingController = new postingControllerLib.PostingController();

        this.journalDataAccess.init();
        this.postingDataAccess.init();

        var self = this;
        this.journalDataAccess.findByField("isPosted", "N", function (err, journals) {
            let postings: postingLib.Posting[] = [];
            if (err === null) {
                journals.forEach((journal: journalLib.Journal) => {
                    journal.isPosted = "Y";

                    let posting: postingLib.Posting = this.postingController.fromJournal(journal);
                    postings.push(posting);

                });

                async.waterfall([
                    function (callback) {
                        self.journalDataAccess.updateAll(journals, function (err, journals) {
                            callback(err);
                        });
                    },
                    function (callback) {
                        self.postingDataAccess.saveAll(postings, function (err, postings) {
                            callback(err);
                        });
                    }],
                    function(err){
                        callback(err);
                    }
                );
            } else {
                console.log("Couldn't update: " + err)
                callback(err);
            }
        }, false)
    }
}