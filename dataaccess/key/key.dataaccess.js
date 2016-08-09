"use strict";
var mongoose = require('mongoose');
var keyControllerLib = require('../../controllers/key/keyController');
var KeyDataAccess = (function () {
    function KeyDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpening = false;
        this.isConnectionOpen = false;
    }
    KeyDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.keyController = new keyControllerLib.KeyController();
            this.keySchema = this.keyController.createKeyMongooseSchema();
            this.keyModel = this.connection.model("key", this.keySchema, "key");
            this.mongooseKey = new this.keyModel();
            this.wasInitialised = true;
            this.isConnectionOpening = true;
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
    KeyDataAccess.prototype.cleanUp = function () {
        if (this.wasInitialised) {
            this.connection.close();
        }
    };
    KeyDataAccess.prototype.find = function (callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        if (!this.wasInitialised) {
            throw new ReferenceError("Journal Data Access module was not initialised");
        }
        var self = this;
        var findFunc = (function () {
            self.keyModel.find({}, function (err, keys) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.keyController.translateMongooseArrayToKeyArray(keys));
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
    KeyDataAccess.prototype.findByField = function (filter, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.keyModel.find(filter, function (err, keys) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.keyController.translateMongooseArrayToKeyArray(keys));
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
    KeyDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.keyModel.findById(id, function (err, key) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.keyController.translateMongooseToKey(key));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    KeyDataAccess.prototype.save = function (newKey, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            self.mongooseKey = new self.keyModel();
            self.keyController.translateKeyToMongoose(newKey, self.mongooseKey);
            self.mongooseKey.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.keyController.translateMongooseToKey(result));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            saveFunc();
        }
    };
    KeyDataAccess.prototype.update = function (id, key, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
            self.keyController.translateKeyToMongoose(key, self.mongooseKey);
            self.keyModel.findByIdAndUpdate(self.mongooseKey._id, self.mongooseKey, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.keyController.translateMongooseToKey(result));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", updateFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            updateFunc();
        }
    };
    KeyDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    KeyDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return KeyDataAccess;
}());
exports.KeyDataAccess = KeyDataAccess;
//# sourceMappingURL=key.dataaccess.js.map