import mongoose = require('mongoose');
import initiative = require('../../models/initiative/initiative');
import initiativeController = require('../../controllers/initiative/initiativeController');

export class InitiativeDataAccess {
    connection: mongoose.Connection;
    initiativeController: initiativeController.InitiativeController;
    wasInitialised: boolean = false;
    isConnectionOpen: boolean = false;
    isConnectionOpening: boolean = false;
    initiativeSchema: any;
    initiativeModel: any;
     dbURI = "mongodb://localhost/goalfish"; 

    init() {
        if (!this.wasInitialised) {
            this.dbURI =  (process.env.MONGODB_URI || "mongodb://localhost/goalfish");  
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection(this.dbURI);
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
        } else {
            throw new ReferenceError("Can't initialise again");

        }

    }

    find(memberId: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.initiativeModel.find({memberId:memberId}, function (err, initiatives) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseArrayToInitiativeArray(initiatives));
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

            //let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            //var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            self.initiativeModel.findById(id, function (err, initiative: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseToInitiative(initiative));
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

    save(newInitiative: initiative.Initiative, callback, closeConnection: boolean = false) {
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
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));
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

    update(id: string, newInitiative: initiative.Initiative, callback, closeConnection: boolean = false) {
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
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));
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

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}