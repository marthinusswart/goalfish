import mongoose = require('mongoose');
import budget = require('../../models/budget/budget');

export class BudgetController {

    createBudgetMongooseSchema() {
        var budgetSchema = new mongoose.Schema({
             externalRef: String,
    id: String,
    name: String,
    description: String,    
    balance: Number,
    underlyingAccount: String,
    instalmentAmount: Number,
            frequency : String
        });

        return budgetSchema;
    }

    translateBudgetToMongoose(budget: budget.Budget, mongooseBudget: any) {
        mongooseBudget.id = budget.id;
        mongooseBudget.name = budget.name;
        mongooseBudget.description = budget.description;        
        mongooseBudget.balance = budget.balance;
        mongooseBudget.instalmentAmount = budget.instalmentAmount;
        mongooseBudget.frequency = budget.frequency;
        mongooseBudget.underlyingAccount = budget.underlyingAccount;

        if (budget.externalRef !== "") {
            mongooseBudget._id = budget.externalRef;
        }

        return 0
    }

    translateMongooseToBudget(mongooseBudget: any): budget.Budget {
        let budgetObj: budget.Budget;
        budgetObj = new budget.Budget();
        budgetObj.externalRef = mongooseBudget._id;
        budgetObj.name = mongooseBudget.name;
        budgetObj.description = mongooseBudget.description;        
        budgetObj.id = mongooseBudget.id;
        budgetObj.balance = mongooseBudget.balance;
        budgetObj.underlyingAccount = mongooseBudget.underlyingAccount;


        return budgetObj;
    }

    translateMongooseArrayToBudgetArray(budgetSchemaArray) {
        var budgetArray = [];
        budgetSchemaArray.forEach((budgetSchema: mongoose.Schema) => {
            budgetArray.push(this.translateMongooseToBudget(budgetSchema));
        });
        return budgetArray;
    }

}