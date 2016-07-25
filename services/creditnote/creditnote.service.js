"use strict";
var creditnote_dataaccess_1 = require('../../dataaccess/creditnote/creditnote.dataaccess');
var key_service_1 = require('../key/key.service');
var CreditNoteService = (function () {
    function CreditNoteService() {
        this.wasInitialised = false;
    }
    CreditNoteService.prototype.init = function () {
        if (!this.wasInitialised) {
            this.creditNoteDataAccess = new creditnote_dataaccess_1.CreditNoteDataAccess();
            this.keyService = new key_service_1.KeyService();
            this.creditNoteDataAccess.init();
            this.keyService.init();
            this.wasInitialised = true;
        }
    };
    return CreditNoteService;
}());
exports.CreditNoteService = CreditNoteService;
//# sourceMappingURL=creditnote.service.js.map