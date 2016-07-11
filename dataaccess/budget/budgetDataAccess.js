"use strict";
var mongoose = require('mongoose');
var budgetController = require('../../controllers/budget/budgetController');
var BudgetDataAccess = (function () {
    function BudgetDataAccess() {
    }
    BudgetDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.budgetController = new budgetController.BudgetController();
    };
    BudgetDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            budgetModel.find({}, function (err, budgets) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    callback(null, self.budgetController.translateMongooseArrayToBudgetArray(budgets));
                }
            });
        });
    };
    BudgetDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            var budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            budgetModel.findById(id, function (err, budget) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(budget);
                    callback(null, self.budgetController.translateMongooseToBudget(budget));
                }
            });
        });
    };
    BudgetDataAccess.prototype.save = function (newBudget, callback) {
        var self = this;
        this.connection.once("open", function () {
            var budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            var mongooseBudget = new budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);
            mongooseBudget.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.budgetController.translateMongooseToBudget(result));
                }
            });
        });
    };
    BudgetDataAccess.prototype.update = function (id, newBudget, callback) {
        var self = this;
        this.connection.once("open", function () {
            var budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            var mongooseBudget = new budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);
            budgetModel.findOneAndUpdate({ "_id": mongooseBudget._id }, mongooseBudget, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.budgetController.translateMongooseToBudget(result));
                }
            });
        });
    };
    return BudgetDataAccess;
}());
exports.BudgetDataAccess = BudgetDataAccess;
//# sourceMappingURL=budgetDataAccess.js.map