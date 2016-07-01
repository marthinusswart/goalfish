import mongoose = require('mongoose');
import initiative = require('../../models/initiative/initiative');
import initiativeController = require('../../controllers/initiative/initiativeController');

export class InitiativeDataAccess {
    connection: mongoose.Connection;
    initiativeController: initiativeController.InitiativeController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.initiativeController = new initiativeController.InitiativeController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            initiativeModel.find({}, function (err, initiatives) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(initiatives);
                    callback(null, self.initiativeController.translateMongooseArrayToInitiativeArray(initiatives));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");
            initiativeModel.findById(id, function (err, initiative:mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(initiative);
                    callback(null, self.initiativeController.translateMongooseToInitiative(initiative));
                }
            });

        });
    }
    
    save(newInitiative: initiative.Initiative, callback){
        var self = this;
        this.connection.once("open", function () {

            let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");            
            var mongooseInitiative = new initiativeModel();
            self.initiativeController.translateInitiativeToMongoose(newInitiative, mongooseInitiative);   
                     
            mongooseInitiative.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));                    
                }
            });

        });
    }
    
     update(id: string, newInitiative: initiative.Initiative, callback){
        var self = this;
        this.connection.once("open", function () {

            let initiativeSchema = self.initiativeController.createInitiativeMongooseSchema();
            var initiativeModel = self.connection.model("initiative", initiativeSchema, "initiative");            
            var mongooseInitiative = new initiativeModel();
            self.initiativeController.translateInitiativeToMongoose(newInitiative, mongooseInitiative);   
                               
            initiativeModel.findOneAndUpdate({"_id":mongooseInitiative._id}, mongooseInitiative, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.initiativeController.translateMongooseToInitiative(result));                    
                }
            });

        });
    }
}