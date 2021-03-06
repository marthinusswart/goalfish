"use strict";
var mongoose = require('mongoose');
var security_controller_1 = require('../../controllers/security/security.controller');
var SecurityDataAccess = (function () {
    function SecurityDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpening = false;
        this.isConnectionOpen = false;
        this.dbURI = "mongodb://localhost/goalfish";
    }
    SecurityDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            this.dbURI = (process.env.MONGODB_URI || "mongodb://localhost/goalfish");
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection(this.dbURI);
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.securityController = new security_controller_1.SecurityController();
            this.tokenSchema = this.securityController.createTokenMongooseSchema();
            this.tokenModel = this.connection.model("token", this.tokenSchema, "token");
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
    SecurityDataAccess.prototype.saveToken = function (token, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            var tokenMongoose = new self.tokenModel();
            self.securityController.convertTokenToMongoose(token, tokenMongoose);
            tokenMongoose.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    token.token = tokenMongoose._id;
                    callback(null, token);
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", saveFunc);
            this.connection.open(this.dbURI);
        }
        else {
            saveFunc();
        }
    };
    SecurityDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.tokenModel.findById(id, function (err, token) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.securityController.translateMongooseToToken(token));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open(this.dbURI);
        }
        else {
            findFunc();
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