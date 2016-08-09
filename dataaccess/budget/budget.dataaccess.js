"use strict";
var mongoose = require('mongoose');
var budget_controller_1 = require('../../controllers/budget/budget.controller');
var transaction_dataaccess_1 = require('../transaction/transaction.dataaccess');
var BudgetDataAccess = (function () {
    function BudgetDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
        this.isConnectionOpening = false;
        this.dbURI = "mongodb://localhost/goalfish";
    }
    BudgetDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            this.dbURI = (process.env.MONGODB_URI || "mongodb://localhost/goalfish");
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection(this.dbURI);
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.budgetController = new budget_controller_1.BudgetController();
            this.transactionDataAccess = new transaction_dataaccess_1.TransactionDataAccess();
            this.transactionDataAccess.init();
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
            this.connection.open(this.dbURI);
        }
        else {
            findFunc();
        }
    };
    BudgetDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
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
            this.connection.open(this.dbURI);
        }
        else {
            findFunc();
        }
    };
    BudgetDataAccess.prototype.findByField = function (filter, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.budgetModel.find(filter, function (err, budgets) {
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
            this.connection.open(this.dbURI);
        }
        else {
            findFunc();
        }
    };
    BudgetDataAccess.prototype.save = function (newBudget, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
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
            this.connection.open(this.dbURI);
        }
        else {
            saveFunc();
        }
    };
    BudgetDataAccess.prototype.update = function (id, newBudget, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
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
            this.connection.open(this.dbURI);
        }
        else {
            updateFunc();
        }
    };
    BudgetDataAccess.prototype.loadTransactions = function (budgetId, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.transactionDataAccess.findByBudgetId(budgetId, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, transactions);
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
//# sourceMappingURL=budget.dataaccess.js.map