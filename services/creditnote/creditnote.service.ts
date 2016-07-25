import { CreditNote } from '../../models/creditnote/creditnote';
import { CreditNoteDataAccess } from '../../dataaccess/creditnote/creditnote.dataaccess';
import { KeyService } from '../key/key.service';
import { Key } from '../../models/key/key';
import async = require('async');

export class CreditNoteService {
    creditNote: CreditNote;
    creditNoteDataAccess: CreditNoteDataAccess;
    keyService: KeyService;

    wasInitialised: boolean = false;

    init() {
        if (!this.wasInitialised) {
            this.creditNoteDataAccess = new CreditNoteDataAccess();
            this.keyService = new KeyService();
            this.creditNoteDataAccess.init();
            this.keyService.init();
            this.wasInitialised = true;
        }
    }
}