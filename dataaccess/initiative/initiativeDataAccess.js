"use strict";
var mongoose = require('mongoose');
var initiativeController = require('../../controllers/initiative/initiativeController');
var InitiativeDataAccess = (function () {
    function InitiativeDataAccess() {
    }
    InitiativeDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.initiativeController = new initiativeController.InitiativeController();
    };
    InitiativeDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            initiativeModel.find({}, function (err, initiatives) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    callback(null, self.initiativeController.translateMongooseArrayToInitiativeArray(initiatives));
                }
            });
        });
    };
    InitiativeDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            var initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            initiativeModel.findById(id, function (err, initiative) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(initiative);
                    callback(null, self.initiativeController.translateMongooseToInitiative(initiative));
                }
            });
        });
    };
    InitiativeDataAccess.prototype.save = function (newInitiative, callback) {
        var self = this;
        this.connection.once("open", function () {
            var initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            var mongooseInitiative = new initiativeModel();
            self.initiativeController.translateInitiativeToMongoose(newInitiative, mongooseInitiative);
            mongooseInitiative.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));
                }
            });
        });
    };
    InitiativeDataAccess.prototype.update = function (id, newInitiative, callback) {
        var self = this;
        this.connection.once("open", function () {
            var initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            var mongooseInitiative = new initiativeModel();
            self.initiativeController.translateInitiativeToMongoose(newInitiative, mongooseInitiative);
            initiativeModel.findOneAndUpdate({ "_id": mongooseInitiative._id }, mongooseInitiative, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));
                }
            });
        });
    };
    return InitiativeDataAccess;
}());
exports.InitiativeDataAccess = InitiativeDataAccess;
//# sourceMappingURL=initiativeDataAccess.js.map