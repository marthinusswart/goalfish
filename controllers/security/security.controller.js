"use strict";
var mongoose = require('mongoose');
var token_1 = require('../../models/security/token');
var SecurityController = (function () {
    function SecurityController() {
    }
    SecurityController.prototype.createTokenMongooseSchema = function () {
        var tokenSchema = new mongoose.Schema({
            token: String,
            memberId: String,
            accounts: []
        });
        return tokenSchema;
    };
    SecurityController.prototype.convertTokenToMongoose = function (token, mongooseToken) {
        mongooseToken.token = token.token;
        mongooseToken.memberId = token.memberId;
        mongooseToken.accounts = token.accounts;
    };
    SecurityController.prototype.translateMongooseToToken = function (mongooseToken) {
        var token = new token_1.Token();
        token.token = mongooseToken._id;
        token.memberId = mongooseToken.memberId;
        token.accounts = mongooseToken.accounts;
        return token;
    };
    return SecurityController;
}());
exports.SecurityController = SecurityController;
//# sourceMappingURL=security.controller.js.map