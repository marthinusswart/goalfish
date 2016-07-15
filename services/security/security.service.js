"use strict";
var security_dataaccess_1 = require('../../dataaccess/security/security.dataaccess');
var memberDataAccess_1 = require('../../dataaccess/member/memberDataAccess');
var underlyingAccountDataAccess_1 = require('../../dataaccess/underlyingaccount/underlyingAccountDataAccess');
var token_1 = require('../../models/security/token');
var SecurityService = (function () {
    function SecurityService() {
    }
    SecurityService.prototype.init = function () {
        this.securityDataAccess = new security_dataaccess_1.SecurityDataAccess();
        this.memberDataAccess = new memberDataAccess_1.MemberDataAccess();
        this.underlyingAccountDataAccess = new underlyingAccountDataAccess_1.UnderlyingAccountDataAccess();
        this.securityDataAccess.init();
        this.memberDataAccess.init();
        this.underlyingAccountDataAccess.init();
    };
    SecurityService.prototype.login = function (credentials, callback) {
        var self = this;
        console.log(credentials.email);
        this.memberDataAccess.findByField({ email: credentials.email }, function (err, members) {
            var member = members[0];
            console.log(member.email);
            var token = new token_1.Token();
            token.memberId = member.id;
            token.token = member.id;
            token.accounts = [];
            console.log(token.memberId);
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
    return SecurityService;
}());
exports.SecurityService = SecurityService;
//# sourceMappingURL=security.service.js.map