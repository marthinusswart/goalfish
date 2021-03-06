import mongoose = require('mongoose');
import { Budget } from '../../models/budget/budget';
import { BudgetController } from '../../controllers/budget/budget.controller';
import { TransactionDataAccess } from '../transaction/transaction.dataaccess';

export class BudgetDataAccess {
    transactionDataAccess: TransactionDataAccess;
    connection: mongoose.Connection;
    budgetController: BudgetController;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;
    budgetSchema: any;
    budgetModel: any;
     dbURI = "mongodb://localhost/goalfish"; 

    init() {
        if (!this.wasInitialised) {
            this.dbURI =  (process.env.MONGODB_URI || "mongodb://localhost/goalfish");  
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection(this.dbURI);
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.budgetController = new BudgetController();
            this.transactionDataAccess = new TransactionDataAccess();
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
        } else {
            throw new ReferenceError("Can't initialise again");

        }
    }

    find(memberId: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.budgetModel.find({ memberId:memberId }, function (err, budgets) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    findById(id: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.budgetModel.findById(id, function (err, budget: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(budget);
                    callback(null, self.budgetController.translateMongooseToBudget(budget));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open(this.dbURI);
        } else {
            findFunc();
        }
    }

     findByField(filter: any, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.budgetModel.find(filter, function (err, budgets) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    save(newBudget: Budget, callback, closeConnection: boolean = false) {
        var self = this;
        var saveFunc = (function () {

            var mongooseBudget = new self.budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);

            mongooseBudget.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            saveFunc();
        }
    }

    update(id: string, newBudget: Budget, callback, closeConnection: boolean = false) {
        var self = this;
        var updateFunc = (function () {

            var mongooseBudget = new self.budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);

            self.budgetModel.findOneAndUpdate({ "_id": mongooseBudget._id }, mongooseBudget, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            updateFunc();
        }
    }

     loadTransactions(budgetId: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.transactionDataAccess.findByBudgetId(budgetId, function (err, transactions) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}