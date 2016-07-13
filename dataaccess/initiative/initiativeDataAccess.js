"use strict";
var mongoose = require('mongoose');
var initiativeController = require('../../controllers/initiative/initiativeController');
var InitiativeDataAccess = (function () {
    function InitiativeDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
        this.isConnectionOpening = false;
    }
    InitiativeDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.initiativeController = new initiativeController.InitiativeController();
            this.initiativeSchema = this.initiativeController.createInitiativeMongooseSchema();
            this.initiativeModel = this.connection.model("initiative", this.initiativeSchema, "initiative");
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
    InitiativeDataAccess.prototype.find = function (callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            //let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            //var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            self.initiativeModel.find({}, function (err, initiatives) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseArrayToInitiativeArray(initiatives));
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
    InitiativeDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            //let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            //var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            self.initiativeModel.findById(id, function (err, initiative) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseToInitiative(initiative));
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
    InitiativeDataAccess.prototype.save = function (newInitiative, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            //let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            //var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");            
            var mongooseInitiative = new self.initiativeModel();
            self.initiativeController.translateInitiativeToMongoose(newInitiative, mongooseInitiative);
            mongooseInitiative.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));
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
    InitiativeDataAccess.prototype.update = function (id, newInitiative, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
            //let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            //var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");            
            var mongooseInitiative = new self.initiativeModel();
            self.initiativeController.translateInitiativeToMongoose(newInitiative, mongooseInitiative);
            self.initiativeModel.findOneAndUpdate({ "_id": mongooseInitiative._id }, mongooseInitiative, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));
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
    InitiativeDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    InitiativeDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return InitiativeDataAccess;
}());
exports.InitiativeDataAccess = InitiativeDataAccess;
//# sourceMappingURL=initiativeDataAccess.js.map