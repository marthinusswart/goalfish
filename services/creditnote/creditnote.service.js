"use strict";
var creditnote_dataaccess_1 = require('../../dataaccess/creditnote/creditnote.dataaccess');
var key_service_1 = require('../key/key.service');
var journal_dataaccess_1 = require('../../dataaccess/journal/journal.dataaccess');
var journal_controller_1 = require('../../controllers/journal/journal.controller');
var async = require('async');
var CreditNoteService = (function () {
    function CreditNoteService() {
        this.wasInitialised = false;
    }
    CreditNoteService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.creditNoteDataAccess = new creditnote_dataaccess_1.CreditNoteDataAccess();
            this.keyService = new key_service_1.KeyService();
            this.journalDataAccess = new journal_dataaccess_1.JournalDataAccess();
            this.journalController = new journal_controller_1.JournalController();
            this.creditNoteDataAccess.init();
            this.keyService.init();
            this.journalDataAccess.init();
            this.wasInitialised = true;
        }
    };
    CreditNoteService.prototype.processCreditNotes = function (creditNotes, callback) {
        var self = this;
        var filter;
        // If an list was given, process the list only, else all pending
        if (creditNotes.length > 0) {
            filter = { id: { $in: creditNotes } };
        }
        else {
            filter = { state: "Pending" };
        }
        var count = 0;
        this.creditNoteDataAccess.findByField(filter, function (err, creditNotes) {
            var journals = [];
            if (err === null) {
                creditNotes.forEach(function (creditNote) {
                    if (creditNote.state === "Pending") {
                        creditNote.state = "Processed";
                        var journalDt = self.journalController.fromCreditNote(creditNote, true);
                        var journalCt = self.journalController.fromCreditNote(creditNote, false);
                        journals.push(journalDt);
                        journals.push(journalCt);
                    }
                });
                async.whilst(function () { return count < journals.length; }, function (callback) {
                    var journalObj = journals[count];
                    count++;
                    self.keyService.getNextKey("journal", function (err, key) {
                        if (err === null) {
                            journalObj.id = journalObj.createIdFromKey(key.key);
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