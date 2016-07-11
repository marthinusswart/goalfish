"use strict";
var trxDataAccessLib = require('../../dataaccess/transaction/transactionDataAccess');
var journalDataAccessLib = require('../../dataaccess/journal/journalDataAccess');
var postingDataAccessLib = require('../../dataaccess/posting/postingDataAccess');
var postingControllerLib = require('../../controllers/posting/postingController');
var async = require('async');
var PostingService = (function () {
    function PostingService() {
    }
    PostingService.prototype.processTransactions = function (callback) {
        this.transactionDataAccess = new trxDataAccessLib.TransactionDataAccess();
        this.transactionDataAccess.init();
        var self = this;
        //this.transactionDataAccess.findByField()
    };
    PostingService.prototype.processJournals = function (callback) {
        this.journalDataAccess = new journalDataAccessLib.JournalDataAccess();
        this.postingDataAccess = new postingDataAccessLib.PostingDataAccess();
        this.postingController = new postingControllerLib.PostingController();
        this.journalDataAccess.init();
        this.postingDataAccess.init();
        var self = this;
        var filter = { isPosted: "N" };
        this.journalDataAccess.findByField(filter, function (err, journals) {
            var postings = [];
            if (err === null) {
                journals.forEach(function (journal) {
                    journal.isPosted = "Y";
                    var posting = self.postingController.fromJournal(journal);
                    postings.push(posting);
                });
                async.waterfall([
                    function (callback) {
                        self.journalDataAccess.updateAll(journals, function (err, journals) {
                            callback(err);
                        }, false);
                    },
                    function (callback) {
                        /* self.postingDataAccess.saveAll(postings, function (err, postings) {
                             callback(err);
                         });*/
                        callback(null);
                    }], function (err) {
                    self.journalDataAccess.cleanUp();
                    callback(err);
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