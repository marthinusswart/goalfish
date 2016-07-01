import mongoose = require('mongoose');
import member = require('../models/member');
import memberController = require('../controllers/memberController');

export class WineMongoDBService {
    connection: mongoose.Connection;
    memberController: memberController.MemberController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "microdb");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.memberController = new memberController.MemberController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let wineSchema = self.memberController.createMemberMongooseSchema();
            var wineModel = self.connection.model("wine", wineSchema, "wine");
            wineModel.find({}, function (err, wines) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(wines);
                    callback(null, self.memberController.translateMongooseArrayToMemberArray(wines));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let wineSchema = self.memberController.createMemberMongooseSchema();
            var wineModel = self.connection.model("wine", wineSchema, "wine");
            wineModel.findById(id, function (err, wine:mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(wine);
                    callback(null, self.memberController.translateMongooseToMember(wine));
                }
            });

        });
    }
    
    save(newWine: wine.Wine, callback){
        var self = this;
        this.connection.once("open", function () {

            let wineSchema = self.wineController.createWineMongooseSchema();
            var wineModel = self.connection.model("wine", wineSchema, "wine");            
            var mongooseWine = new wineModel();
            self.wineController.translateWineToMongoose(newWine, mongooseWine);   
                     
            mongooseWine.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.wineController.translateMongooseToWine(result));                    
                }
            });

        });
    }
    
     update(id: string, newWine: wine.Wine, callback){
        var self = this;
        this.connection.once("open", function () {

            let wineSchema = self.wineController.createWineMongooseSchema();
            var wineModel = self.connection.model("wine", wineSchema, "wine");            
            var mongooseWine = new wineModel();
            self.wineController.translateWineToMongoose(newWine, mongooseWine);   
                               
            wineModel.findOneAndUpdate({"_id":mongooseWine._id}, mongooseWine, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.wineController.translateMongooseToWine(result));                    
                }
            });

        });
    }
}