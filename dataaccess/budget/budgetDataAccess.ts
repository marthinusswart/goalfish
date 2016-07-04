import mongoose = require('mongoose');
import budget = require('../../models/budget/budget');
import budgetController = require('../../controllers/budget/budgetController');

export class BudgetDataAccess {
    connection: mongoose.Connection;
    budgetController: budgetController.BudgetController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.budgetController = new budgetController.BudgetController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            budgetModel.find({}, function (err, budgets) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(budgets);
                    callback(null, self.budgetController.translateMongooseArrayToBudgetArray(budgets));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");
            budgetModel.findById(id, function (err, budget:mongoose.Schema) {
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
    }
    
    save(newBudget: budget.Budget, callback){
        var self = this;
        this.connection.once("open", function () {

            let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");            
            var mongooseBudget = new budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);   
                     
            mongooseBudget.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.budgetController.translateMongooseToBudget(result));                    
                }
            });

        });
    }
    
     update(id: string, newBudget: budget.Budget, callback){
        var self = this;
        this.connection.once("open", function () {

            let budgetSchema = self.budgetController.createBudgetMongooseSchema();
            var budgetModel = self.connection.model("budget", budgetSchema, "budget");            
            var mongooseBudget = new budgetModel();
            self.budgetController.translateBudgetToMongoose(newBudget, mongooseBudget);   
                               
            budgetModel.findOneAndUpdate({"_id":mongooseBudget._id}, mongooseBudget, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.budgetController.translateMongooseToBudget(result));                    
                }
            });

        });
    }
}