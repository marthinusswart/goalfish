"use strict";
var mongoose = require('mongoose');
var budgetController = require('../../controllers/budget/budgetController');
var BudgetDataAccess = (function () {
    function BudgetDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
        this.isConnectionOpening = false;
    }
    BudgetDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.budgetController = new budgetController.BudgetController();
            this.budgetSchema = this.budgetController.createBudgetMongooseSchema();
            this.budgetModel = this.connection.model("budget", this.budgetSchema, "budget");
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
    BudgetDataAccess.prototype.find = function (memberId, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.budgetModel.find({ memberId: memberId }, function (err, budgets) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.budgetController.translateMongooseArrayToBudgetArray(budgets));
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
    BudgetDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            //let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            //var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            self.budgetModel.findById(id, function (err, budget) {
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
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    BudgetDataAccess.prototype.save = function (newBudget, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            //let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            //var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            var mongooseBudget = new self.budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);
            mongooseBudget.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.budgetController.translateMongooseToBudget(result));
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
    BudgetDataAccess.prototype.update = function (id, newBudget, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
            //let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            //var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            var mongooseBudget = new self.budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);
            self.budgetModel.findOneAndUpdate({ "_id": mongooseBudget._id }, mongooseBudget, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.budgetController.translateMongooseToBudget(result));
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
    BudgetDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    BudgetDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return BudgetDataAccess;
}());
exports.BudgetDataAccess = BudgetDataAccess;
//# sourceMappingURL=budgetDataAccess.js.map