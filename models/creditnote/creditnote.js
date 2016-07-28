"use strict";
var CreditNote = (function () {
    function CreditNote() {
        this.externalRef = "";
        this.id = "";
        this.name = "";
        this.description = "";
        this.amount = 0;
        this.date = new Date();
        this.state = "Pending";
    }
    CreditNote.prototype.createIdFromKey = function (key) {
        var keyStr = "CRN" + key;
        if (key < 1000) {
            keyStr = "CRN" + ("0000" + key).slice(-4);
        }
        return keyStr;
    };
    return CreditNote;
}());
exports.CreditNote = CreditNote;
//# sourceMappingURL=creditnote.js.map