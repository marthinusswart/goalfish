import { CreditNote } from '../../models/creditnote/creditnote';
import { CreditNoteDataAccess } from '../../dataaccess/creditnote/creditnote.dataaccess';
import { KeyService } from '../key/key.service';
import { Key } from '../../models/key/key';
import { JournalDataAccess } from '../../dataaccess/journal/journal.dataAccess';
import { Journal } from '../../models/journal/journal';
import { JournalController } from '../../controllers/journal/journal.controller';
import async = require('async');

export class CreditNoteService {
    creditNote: CreditNote;
    creditNoteDataAccess: CreditNoteDataAccess;
    keyService: KeyService;
    journalDataAccess: JournalDataAccess;
    journalController: JournalController;

    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            this.creditNoteDataAccess = new CreditNoteDataAccess();
            this.keyService = new KeyService();
            this.journalDataAccess = new JournalDataAccess();
            this.journalController = new JournalController();
            this.creditNoteDataAccess.init();
            this.keyService.init();
            this.journalDataAccess.init();
            this.wasInitialised = true;
        }
    }

    processCreditNotes(creditNotes: string[], callback) {

        var self = this;
        let filter: any;

        // If an list was given, process the list only, else all pending
        if (creditNotes.length > 0) {
            filter = { id: { $in: creditNotes } };
        } else {
            filter = { state: "Pending" };
        }

        let count = 0;

        this.creditNoteDataAccess.findByField(filter, function (err, creditNotes) {
            let journals: Journal[] = [];
            if (err === null) {
                creditNotes.forEach((creditNote: CreditNote) => {
                    if (creditNote.state === "Pending") {
                        creditNote.state = "Processed";
                        let journalDt: Journal = self.journalController.fromCreditNote(creditNote, true);
                        let journalCt: Journal = self.journalController.fromCreditNote(creditNote, false);
                        journals.push(journalDt);
                        journals.push(journalCt);
                    }
                });

                async.whilst(() => { return count < journals.length; },
                    (callback) => {
                        let journalObj: Journal = journals[count];
                        count++;

                        self.keyService.getNextKey("journal", function (err, key: Key) {
                            if (err === null) {
                                journalObj.id = journalObj.createIdFromKey(key.key);
                            } else {
                                console.log("Failed to load key " + err);
                            }
                            callback();
                        });
                    },
                    (err) => {
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
                            }],
                            function (err) {
                                callback(err, { result: "OK" });
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