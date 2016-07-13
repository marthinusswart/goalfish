"use strict";
var mongoose = require('mongoose');
var underlyingAccountController = require('../../controllers/underlyingaccount/underlyingAccountController');
var UnderlyingAccountDataAccess = (function () {
    function UnderlyingAccountDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
        this.isConnectionOpening = false;
    }
    UnderlyingAccountDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.underlyingAccountController = new underlyingAccountController.UnderlyingAccountController();
            this.underlyingAccountSchema = this.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            this.underlyingAccountModel = this.connection.model("underlyingaccount", this.underlyingAccountSchema, "underlyingaccount");
            this.isConnectionOpening = true;
            this.wasInitialised = true;
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
    UnderlyingAccountDataAccess.prototype.find = function (callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.underlyingAccountModel.find({}, function (err, underlyingAccounts) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseArrayToUnderlyingAccountArray(underlyingAccounts));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    UnderlyingAccountDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.underlyingAccountModel.findById(id, function (err, underlyingAccount) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(underlyingAccount));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    UnderlyingAccountDataAccess.prototype.save = function (newUnderlyingAccount, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            var mongooseUnderlyingAccount = new self.underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);
            mongooseUnderlyingAccount.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            saveFunc();
        }
    };
    UnderlyingAccountDataAccess.prototype.update = function (id, newUnderlyingAccount, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
            var mongooseUnderlyingAccount = new self.underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);
            self.underlyingAccountModel.findOneAndUpdate({ "_id": mongooseUnderlyingAccount._id }, mongooseUnderlyingAccount, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", updateFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            updateFunc();
        }
    };
    UnderlyingAccountDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    UnderlyingAccountDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return UnderlyingAccountDataAccess;
}());
exports.UnderlyingAccountDataAccess = UnderlyingAccountDataAccess;
//# sourceMappingURL=underlyingAccountDataAccess.js.map