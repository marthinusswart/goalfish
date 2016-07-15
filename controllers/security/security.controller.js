"use strict";
var mongoose = require('mongoose');
var SecurityController = (function () {
    function SecurityController() {
    }
    SecurityController.prototype.createTokenMongooseSchema = function () {
        var tokenSchema = new mongoose.Schema({
            externalRef: String,
            token: String,
            memberId: String,
            accounts: []
        });
        return tokenSchema;
    };
    SecurityController.prototype.convertTokenToMongoose = function (token, mongooseToken) {
        mongooseToken.token = token.token;
        mongooseToken.memberIf = token.memberId;
        mongooseToken.accounts = token.accounts;
    };
    return SecurityController;
}());
exports.SecurityController = SecurityController;
//# sourceMappingURL=security.controller.js.map