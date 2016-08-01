"use strict";
var Transaction = (function () {
    function Transaction() {
        this.externalRef = "";
        this.id = "";
        this.referenceId = "";
        this.description = "";
        this.classification = "";
        this.amount = 0;
        this.date = new Date();
        this.underlyingAccount = "";
        this.isPosted = "N";
        this.memberId = "";
    }
    Transaction.prototype.createIdFromKey = function (key) {
        var keyStr = "TRN" + key;
        if (key < 1000) {
            keyStr = "TRN" + ("0000" + key).slice(-4);
        }
        return keyStr;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map