"use strict";
var mongoose = require('mongoose');
var underlyingAccountController = require('../../controllers/underlyingaccount/underlyingAccountController');
var UnderlyingAccountDataAccess = (function () {
    function UnderlyingAccountDataAccess() {
    }
    UnderlyingAccountDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.underlyingAccountController = new underlyingAccountController.UnderlyingAccountController();
    };
    UnderlyingAccountDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            underlyingAccountModel.find({}, function (err, underlyingAccounts) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    callback(null, self.underlyingAccountController.translateMongooseArrayToUnderlyingAccountArray(underlyingAccounts));
                }
            });
        });
    };
    UnderlyingAccountDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            var underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            underlyingAccountModel.findById(id, function (err, underlyingAccount) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(underlyingAccount);
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(underlyingAccount));
                }
            });
        });
    };
    UnderlyingAccountDataAccess.prototype.save = function (newUnderlyingAccount, callback) {
        var self = this;
        this.connection.once("open", function () {
            var underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            var mongooseUnderlyingAccount = new underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);
            mongooseUnderlyingAccount.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));
                }
            });
        });
    };
    UnderlyingAccountDataAccess.prototype.update = function (id, newUnderlyingAccount, callback) {
        var self = this;
        this.connection.once("open", function () {
            var underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            var mongooseUnderlyingAccount = new underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);
            underlyingAccountModel.findOneAndUpdate({ "_id": mongooseUnderlyingAccount._id }, mongooseUnderlyingAccount, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));
                }
            });
        });
    };
    return UnderlyingAccountDataAccess;
}());
exports.UnderlyingAccountDataAccess = UnderlyingAccountDataAccess;
//# sourceMappingURL=underlyingAccountDataAccess.js.map