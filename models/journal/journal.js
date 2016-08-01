"use strict";
var Journal = (function () {
    function Journal() {
        this.externalRef = "";
        this.id = "";
        this.name = "";
        this.description = "";
        this.amount = 0;
        this.date = new Date();
        this.accountNumber = "";
        this.isPosted = "N";
        this.memberId = "";
    }
    Journal.prototype.createIdFromKey = function (key) {
        var keyStr = "JNL" + key;
        if (key < 1000) {
            keyStr = "JNL" + ("0000" + key).slice(-4);
        }
        return keyStr;
    };
    return Journal;
}());
exports.Journal = Journal;
//# sourceMappingURL=journal.js.map