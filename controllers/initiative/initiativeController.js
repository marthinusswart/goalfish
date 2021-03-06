"use strict";
var mongoose = require('mongoose');
var initiative = require('../../models/initiative/initiative');
var InitiativeController = (function () {
    function InitiativeController() {
    }
    InitiativeController.prototype.createInitiativeMongooseSchema = function () {
        var initiativeSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            targetBalance: Number,
            targetDate: Date,
            balance: Number,
            underlyingAccount: String,
            instalmentAmount: Number,
            frequency: String,
            memberId: String
        });
        return initiativeSchema;
    };
    InitiativeController.prototype.translateInitiativeToMongoose = function (initiative, mongooseInitiative) {
        mongooseInitiative.id = initiative.id;
        mongooseInitiative.name = initiative.name;
        mongooseInitiative.description = initiative.description;
        mongooseInitiative.targetBalance = initiative.targetBalance;
        mongooseInitiative.targetDate = initiative.targetDate;
        mongooseInitiative.balance = initiative.balance;
        mongooseInitiative.instalmentAmount = initiative.instalmentAmount;
        mongooseInitiative.frequency = initiative.frequency;
        mongooseInitiative.underlyingAccount = initiative.underlyingAccount;
        mongooseInitiative.memberId = initiative.memberId;
        if (initiative.externalRef !== "") {
            mongooseInitiative._id = initiative.externalRef;
        }
        return 0;
    };
    InitiativeController.prototype.translateMongooseToInitiative = function (mongooseInitiative) {
        var initiativeObj;
        initiativeObj = new initiative.Initiative();
        initiativeObj.externalRef = mongooseInitiative._id;
        initiativeObj.name = mongooseInitiative.name;
        initiativeObj.description = mongooseInitiative.description;
        initiativeObj.targetBalance = mongooseInitiative.targetBalance;
        initiativeObj.targetDate = mongooseInitiative.targetDate;
        initiativeObj.id = mongooseInitiative.id;
        initiativeObj.balance = mongooseInitiative.balance;
        initiativeObj.instalmentAmount = mongooseInitiative.instalmentAmount;
        initiativeObj.frequency = mongooseInitiative.frequency;
        initiativeObj.underlyingAccount = mongooseInitiative.underlyingAccount;
        initiativeObj.memberId = mongooseInitiative.memberId;
        return initiativeObj;
    };
    InitiativeController.prototype.translateMongooseArrayToInitiativeArray = function (initiativeSchemaArray) {
        var _this = this;
        var initiativeArray = [];
        initiativeSchemaArray.forEach(function (initiativeSchema) {
            initiativeArray.push(_this.translateMongooseToInitiative(initiativeSchema));
        });
        return initiativeArray;
    };
    return InitiativeController;
}());
exports.InitiativeController = InitiativeController;
//# sourceMappingURL=initiativeController.js.map