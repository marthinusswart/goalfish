import journalDataAccessLib = require('../../dataaccess/journal/journal.dataAccess');
import journalLib = require('../../models/journal/journal');

export class JournalMaintenanceService {
    journalDataAccess: journalDataAccessLib.JournalDataAccess;

    init() {
        this.journalDataAccess = new journalDataAccessLib.JournalDataAccess();
        this.journalDataAccess.init();
    }

    markAllAsPosted(callback) {
        var self = this;
        this.journalDataAccess.find([], function (err, journals) {
            if (err === null) {
                journals.forEach((journal: journalLib.Journal) => {
                    journal.isPosted = "Y";
                });
                self.journalDataAccess.updateAll(journals, function (err, journals) {
                    callback(err);
                })
            } else {
                console.log("Couldn't update: " + err)
                callback(err);
            }
        }, false);
    }

    markAllAsNotPosted(callback) {
        var self = this;
        this.journalDataAccess.find([], function (err, journals) {
            if (err === null) {
                journals.forEach((journal: journalLib.Journal) => {
                    journal.isPosted = "N";
                });
                self.journalDataAccess.updateAll(journals, function (err, journals) {
                    callback(err);
                })
            } else {
                console.log("Couldn't update: " + err)
                callback(err);
            }
        }, false);
    }
}