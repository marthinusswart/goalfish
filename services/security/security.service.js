"use strict";
var security_dataaccess_1 = require('../../dataaccess/security/security.dataaccess');
var member_dataaccess_1 = require('../../dataaccess/member/member.dataaccess');
var underlyingAccount_dataaccess_1 = require('../../dataaccess/underlyingaccount/underlyingAccount.dataaccess');
var token_1 = require('../../models/security/token');
var SecurityService = (function () {
    function SecurityService() {
    }
    SecurityService.prototype.init = function () {
        this.securityDataAccess = new security_dataaccess_1.SecurityDataAccess();
        this.memberDataAccess = new member_dataaccess_1.MemberDataAccess();
        this.underlyingAccountDataAccess = new underlyingAccount_dataaccess_1.UnderlyingAccountDataAccess();
        this.securityDataAccess.init();
        this.memberDataAccess.init();
        this.underlyingAccountDataAccess.init();
    };
    SecurityService.prototype.login = function (credentials, callback) {
        var self = this;
        this.memberDataAccess.findByField({ email: credentials.email }, function (err, members) {
            var member = members[0];
            var token = new token_1.Token();
            token.memberId = member.id;
            token.accounts = [];
            self.underlyingAccountDataAccess.find(member.id, function (err, accounts) {
                accounts.forEach(function (account) {
                    token.accounts.push(account.id);
                });
                self.securityDataAccess.saveToken(token, function (err, token) {
                    callback(err, token);
                });
            });
        });
    };
    SecurityService.prototype.getToken = function (tokenString, callback) {
        var self = this;
        this.securityDataAccess.findById(tokenString, function (err, token) {
            callback(err, token);
        });
    };
    return SecurityService;
}());
exports.SecurityService = SecurityService;
//# sourceMappingURL=security.service.js.map