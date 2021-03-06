import mongoose = require('mongoose');
import { Budget } from '../../models/budget/budget';

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
            frequency: String,
            memberId: String
        });

        return budgetSchema;
    }

    translateBudgetToMongoose(budget: Budget, mongooseBudget: any) {
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

        return 0
    }

    translateMongooseToBudget(mongooseBudget: any): Budget {
        let budgetObj: Budget;
        budgetObj = new Budget();
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
    }

    translateMongooseArrayToBudgetArray(budgetSchemaArray) {
        var budgetArray = [];
        budgetSchemaArray.forEach((budgetSchema: mongoose.Schema) => {
            budgetArray.push(this.translateMongooseToBudget(budgetSchema));
        });
        return budgetArray;
    }

}