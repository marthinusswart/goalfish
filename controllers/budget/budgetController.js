"use strict";
var mongoose = require('mongoose');
var budget = require('../../models/budget/budget');
var BudgetController = (function () {
    function BudgetController() {
    }
    BudgetController.prototype.createBudgetMongooseSchema = function () {
        var budgetSchema = new mongoose.Schema({
            externalRef: String,
            id: String,
            name: String,
            description: String,
            balance: Number,
            underlyingAccount: String,
            instalmentAmount: Number,
            frequency: String
        });
        return budgetSchema;
    };
    BudgetController.prototype.translateBudgetToMongoose = function (budget, mongooseBudget) {
        mongooseBudget.id = budget.id;
        mongooseBudget.name = budget.name;
        mongooseBudget.description = budget.description;
        mongooseBudget.balance = budget.balance;
        mongooseBudget.instalmentAmount = budget.instalmentAmount;
        mongooseBudget.frequency = budget.frequency;
        mongooseBudget.underlyingAccount = budget.underlyingAccount;
        mongooseBudget.memberId = budget.memberId;
        if (budget.externalRef !== "") {
            mongooseBudget._id = budget.externalRef;
        }
        return 0;
    };
    BudgetController.prototype.translateMongooseToBudget = function (mongooseBudget) {
        var budgetObj;
        budgetObj = new budget.Budget();
        budgetObj.externalRef = mongooseBudget._id;
        budgetObj.name = mongooseBudget.name;
        budgetObj.description = mongooseBudget.description;
        budgetObj.id = mongooseBudget.id;
        budgetObj.balance = mongooseBudget.balance;
        budgetObj.instalmentAmount = mongooseBudget.instalmentAmount;
        budgetObj.frequency = mongooseBudget.frequency;
        budgetObj.underlyingAccount = mongooseBudget.underlyingAccount;
        budgetObj.memberId = mongooseBudget.memberId;
        return budgetObj;
    };
    BudgetController.prototype.translateMongooseArrayToBudgetArray = function (budgetSchemaArray) {
        var _this = this;
        var budgetArray = [];
        budgetSchemaArray.forEach(function (budgetSchema) {
            budgetArray.push(_this.translateMongooseToBudget(budgetSchema));
        });
        return budgetArray;
    };
    return BudgetController;
}());
exports.BudgetController = BudgetController;
//# sourceMappingURL=budgetController.js.map