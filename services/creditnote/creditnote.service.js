"use strict";
var creditnote_dataaccess_1 = require('../../dataaccess/creditnote/creditnote.dataaccess');
var key_service_1 = require('../key/key.service');
var journal_dataAccess_1 = require('../../dataaccess/journal/journal.dataAccess');
//import { PostingDataAccess } from '../../dataaccess/posting/postingDataAccess';
//import { Posting } from '../../models/posting/posting';
var journalController_1 = require('../../controllers/journal/journalController');
var async = require('async');
var CreditNoteService = (function () {
    function CreditNoteService() {
        this.wasInitialised = false;
    }
    CreditNoteService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.creditNoteDataAccess = new creditnote_dataaccess_1.CreditNoteDataAccess();
            this.keyService = new key_service_1.KeyService();
            this.journalDataAccess = new journal_dataAccess_1.JournalDataAccess();
            this.journalController = new journalController_1.JournalController();
            this.creditNoteDataAccess.init();
            this.keyService.init();
            this.journalDataAccess.init();
            this.wasInitialised = true;
        }
    };
    CreditNoteService.prototype.processCreditNotes = function (callback) {
        // this.postingDataAccess = new PostingDataAccess();
        // this.postingController = new PostingController();
        // this.postingDataAccess.init();
        // this.keyService.init();
        var self = this;
        var filter = { state: "Pending" };
        var count = 0;
        this.creditNoteDataAccess.findByField(filter, function (err, creditNotes) {
            var journals = [];
            if (err === null) {
                creditNotes.forEach(function (creditNote) {
                    creditNote.state = "Processed";
                    var journal = self.journalController.fromCreditNote(creditNote);
                    journals.push(journal);
                });
                async.whilst(function () { return count < journals.length; }, function (callback) {
                    var journalObj = journals[count];
                    count++;
                    self.keyService.getNextKey("journal", function (err, key) {
                        if (err === null) {
                            journalObj.createIdFromKey(key.key);
                        }
                        else {
                            console.log("Failed to load key " + err);
                        }
                        callback();
                    });
                }, function (err) {
                    async.waterfall([
                        function (callbackWf) {
                            self.creditNoteDataAccess.updateAll(creditNotes, function (err, creditNotes) {
                                callbackWf(err);
                            });
                        },
                        function (callbackWf) {
                            self.journalDataAccess.saveAll(journals, function (err, journals) {
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
    return CreditNoteService;
}());
exports.CreditNoteService = CreditNoteService;
//# sourceMappingURL=creditnote.service.js.map