import mongoose = require('mongoose');
import underlyingAccount = require('../../models/underlyingaccount/underlyingaccount');
import underlyingAccountController = require('../../controllers/underlyingaccount/underlyingAccountController');

export class UnderlyingAccountDataAccess {
    connection: mongoose.Connection;
    underlyingAccountController: underlyingAccountController.UnderlyingAccountController;
    underlyingAccountSchema: any;
    underlyingAccountModel: any;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.underlyingAccountController = new underlyingAccountController.UnderlyingAccountController();
            this.underlyingAccountSchema = this.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            this.underlyingAccountModel = this.connection.model("underlyingaccount", this.underlyingAccountSchema, "underlyingaccount");
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

    find(callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.underlyingAccountModel.find({}, function (err, underlyingAccounts) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseArrayToUnderlyingAccountArray(underlyingAccounts));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    findById(id: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            let underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            underlyingAccountModel.findById(id, function (err, underlyingAccount: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(underlyingAccount));
                }
            });

        });

        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            findFunc();
        }
    }

    save(newUnderlyingAccount: underlyingAccount.UnderlyingAccount, callback, closeConnection: boolean = false) {
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
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));
                }
            });

        });
    }

    update(id: string, newUnderlyingAccount: underlyingAccount.UnderlyingAccount, callback, closeConnection: boolean = false) {
        var self = this;
        this.connection.once("open", function () {

            let underlyingAccountSchema = self.underlyingAccountController.createUnderlyingAccountMongooseSchema();
            var underlyingAccountModel = self.connection.model("underlyingaccount", underlyingAccountSchema, "underlyingaccount");
            var mongooseUnderlyingAccount = new underlyingAccountModel();
            self.underlyingAccountController.translateUnderlyingAccountToMongoose(newUnderlyingAccount, mongooseUnderlyingAccount);

            underlyingAccountModel.findOneAndUpdate({ "_id": mongooseUnderlyingAccount._id }, mongooseUnderlyingAccount, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.underlyingAccountController.translateMongooseToUnderlyingAccount(result));
                }
            });

        });
    }

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}