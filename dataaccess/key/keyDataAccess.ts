import mongoose = require('mongoose');
import keyLib = require('../../models/key/key');
import keyControllerLib = require('../../controllers/key/keyController');

export class KeyDataAccess {
    connection: mongoose.Connection;
    keyController: keyControllerLib.KeyController;
    wasInitialised: boolean = false;
    isConnectionOpening: boolean = false;
    isConnectionOpen: boolean = false;
    keySchema: any;
    keyModel: any;
    mongooseKey: any;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
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
        } else {
            throw new ReferenceError("Can't initialise again");
        }

    }

    cleanUp() {
        if (this.wasInitialised) {
            this.connection.close();
        }
    }

    find(callback, closeConnection: boolean = false) {
        if (!this.wasInitialised) {
            throw new ReferenceError("Journal Data Access module was not initialised");
        }

        var self = this;

        var findFunc = (function () {
            self.keyModel.find({}, function (err, keys) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    findByField(filter: any, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.keyModel.find(filter, function (err, keys) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    findById(id: string, callback, closeConnection: boolean = false) {
        var self = this;

        var findFunc = (function () {

            self.keyModel.findById(id, function (err, key: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    save(newKey: keyLib.Key, callback, closeConnection: boolean = false) {
        var self = this;

        var saveFunc = (function () {

            self.mongooseKey = new self.keyModel();
            self.keyController.translateKeyToMongoose(newKey, self.mongooseKey);

            self.mongooseKey.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close()
                    }

                    callback(null, self.keyController.translateMongooseToKey(result));
                }
            });
        });

        if (!this.isConnectionOpen) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        } else {
            saveFunc();
        }
    }

    update(id: string, key: keyLib.Key, callback, closeConnection: boolean = false) {
        var self = this;

        var updateFunc = (function () {
            self.keyController.translateKeyToMongoose(key, self.mongooseKey);
            self.keyModel.findByIdAndUpdate(self.mongooseKey._id, self.mongooseKey, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            updateFunc();
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