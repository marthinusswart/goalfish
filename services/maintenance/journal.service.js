"use strict";
var journalDataAccessLib = require('../../dataaccess/journal/journalDataAccess');
var JournalMaintenanceService = (function () {
    function JournalMaintenanceService() {
    }
    JournalMaintenanceService.prototype.init = function () {
        this.journalDataAccess = new journalDataAccessLib.JournalDataAccess();
        this.journalDataAccess.init();
    };
    JournalMaintenanceService.prototype.markAllAsPosted = function (callback) {
        var self = this;
        this.journalDataAccess.find(function (err, journals) {
            if (err === null) {
                journals.forEach(function (journal) {
                    journal.isPosted = "Y";
                });
                self.journalDataAccess.updateAll(journals, function (err, journals) {
                    callback(err);
                });
            }
            else {
                console.log("Couldn't update: " + err);
                callback(err);
            }
        }, false);
    };
    JournalMaintenanceService.prototype.markAllAsNotPosted = function (callback) {
        var self = this;
        this.journalDataAccess.find(function (err, journals) {
            if (err === null) {
                journals.forEach(function (journal) {
                    journal.isPosted = "N";
                });
                self.journalDataAccess.updateAll(journals, function (err, journals) {
                    callback(err);
                });
            }
            else {
                console.log("Couldn't update: " + err);
                callback(err);
            }
        }, false);
    };
    return JournalMaintenanceService;
}());
exports.JournalMaintenanceService = JournalMaintenanceService;
//# sourceMappingURL=journal.service.js.map