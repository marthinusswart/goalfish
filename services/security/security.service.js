"use strict";
var security_dataaccess_1 = require('../../dataaccess/security/security.dataaccess');
var SecurityService = (function () {
    function SecurityService() {
    }
    SecurityService.prototype.init = function () {
        this.securityDataAccess = new security_dataaccess_1.SecurityDataAccess();
        this.securityDataAccess.init();
    };
    return SecurityService;
}());
exports.SecurityService = SecurityService;
//# sourceMappingURL=security.service.js.map