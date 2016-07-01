import mongoose = require('mongoose');
import underlyingAccount = require('../../models/underlyingaccount/underlyingaccount');
import underlyingAccountController = require('../../controllers/underlyingaccount/underlyingAccountController');

export class UnderlyingAccountDataAccess {
    connection: mongoose.Connection;
    underlyingAccountController: underlyingAccountController.UnderlyingAccountController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.underlyingAccountController = new underlyingAccountController.UnderlyingAccountController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            underlyingAccountModel.find({}, function (err, underlyingAccounts) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(underlyingAccounts);
                    callback(null, self.underlyingAccountController.translateMongooseArrayToUnderlyingAccountArray(underlyingAccounts));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            underlyingAccountModel.findById(id, function (err, underlyingAccount:mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(underlyingAccount);
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(underlyingAccount));
                }
            });

        });
    }
    
    save(newUnderlyingAccount: underlyingAccount.UnderlyingAccount, callback){
        var self = this;
        this.connection.once("open", function () {

            let underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");            
            var mongooseUnderlyingAccount = new underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);   
                     
            mongooseUnderlyingAccount.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));                    
                }
            });

        });
    }
    
     update(id: string, newUnderlyingAccount: underlyingAccount.UnderlyingAccount, callback){
        var self = this;
        this.connection.once("open", function () {

            let underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");            
            var mongooseUnderlyingAccount = new underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);   
                               
            underlyingAccountModel.findOneAndUpdate({"_id":mongooseUnderlyingAccount._id}, mongooseUnderlyingAccount, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));                    
                }
            });

        });
    }
}