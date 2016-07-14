"use strict";
var mongoose = require('mongoose');
var security_controller_1 = require('../../controllers/security/security.controller');
var SecurityDataAccess = (function () {
    function SecurityDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpening = false;
        this.isConnectionOpen = false;
    }
    SecurityDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.securityController = new security_controller_1.SecurityController();
            this.tokenSchema = this.securityController.createTokenMongooseSchema();
            this.tokenModel = this.connection.model("token", this.tokenSchema, "token");
            this.mongooseToken = new this.tokenModel();
            this.wasInitialised = true;
            this.isConnectionOpening = true;
            this.connection.on("close", function () {
                self.onConnectionClose();
            });
            this.connection.on("open", function () {
                self.onConnectionOpen();
            });
        }
        else {
            throw new ReferenceError("Can't initialise again");
        }
    };
    SecurityDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    SecurityDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return SecurityDataAccess;
}());
exports.SecurityDataAccess = SecurityDataAccess;
//# sourceMappingURL=security.dataaccess.js.map