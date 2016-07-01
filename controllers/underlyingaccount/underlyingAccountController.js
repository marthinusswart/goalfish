"use strict";
var mongoose = require('mongoose');
var underlyingAccount = require('../../models/underlyingaccount/underlyingAccount');
var UnderlyingAccountController = (function () {
    function UnderlyingAccountController() {
    }
    UnderlyingAccountController.prototype.createUnderlyingAccountMongooseSchema = function () {
        var UnderlyingAccountSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            productName: String,
            interestRate: Number,
            accountNumber: String,
            holdingInstitution: String,
            balance: Number
        });
        return UnderlyingAccountSchema;
    };
    UnderlyingAccountController.prototype.translateUnderlyingAccountToMongoose = function (underlyingAccount, mongooseUnderlyingAccount) {
        mongooseUnderlyingAccount.id = underlyingAccount.id;
        mongooseUnderlyingAccount.name = underlyingAccount.name;
        mongooseUnderlyingAccount.description = underlyingAccount.description;
        mongooseUnderlyingAccount.productName = underlyingAccount.productName;
        mongooseUnderlyingAccount.interestRate = underlyingAccount.interestRate;
        mongooseUnderlyingAccount.balance = underlyingAccount.balance;
        mongooseUnderlyingAccount.accountNumber = underlyingAccount.accountNumber;
        mongooseUnderlyingAccount.holdingInstitution = underlyingAccount.holdingInstitution;
        if (underlyingAccount.externalRef !== "") {
            mongooseUnderlyingAccount._id = underlyingAccount.externalRef;
        }
        return 0;
    };
    UnderlyingAccountController.prototype.translateMongooseToUnderlyingAccount = function (mongooseUnderlyingAccount) {
        var underlyingAccountObj;
        underlyingAccountObj = new underlyingAccount.UnderlyingAccount();
        underlyingAccountObj.externalRef = mongooseUnderlyingAccount._id;
        underlyingAccountObj.name = mongooseUnderlyingAccount.name;
        underlyingAccountObj.description = mongooseUnderlyingAccount.description;
        underlyingAccountObj.productName = mongooseUnderlyingAccount.productName;
        underlyingAccountObj.interestRate = mongooseUnderlyingAccount.interestRate;
        underlyingAccountObj.id = mongooseUnderlyingAccount.id;
        underlyingAccountObj.balance = mongooseUnderlyingAccount.balance;
        underlyingAccountObj.accountNumber = mongooseUnderlyingAccount.accountNumber;
        underlyingAccountObj.holdingInstitution = mongooseUnderlyingAccount.holdingInstitution;
        return underlyingAccountObj;
    };
    UnderlyingAccountController.prototype.translateMongooseArrayToUnderlyingAccountArray = function (underlyingAccountSchemaArray) {
        var _this = this;
        var underlyingAccountArray = [];
        underlyingAccountSchemaArray.forEach(function (underlyingAccountSchema) {
            underlyingAccountArray.push(_this.translateMongooseToUnderlyingAccount(underlyingAccountSchema));
        });
        return underlyingAccountArray;
    };
    return UnderlyingAccountController;
}());
exports.UnderlyingAccountController = UnderlyingAccountController;
//# sourceMappingURL=underlyingAccountController.js.map