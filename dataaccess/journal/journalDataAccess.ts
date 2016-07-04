import mongoose = require('mongoose');
import journal = require('../../models/journal/journal');
import journalController = require('../../controllers/journal/journalController');

export class JournalDataAccess {
    connection: mongoose.Connection;
    journalController: journalController.JournalController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.journalController = new journalController.JournalController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            journalModel.find({}, function (err, journals) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(journals);
                    callback(null, self.journalController.translateMongooseArrayToJournalArray(journals));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");
            journalModel.findById(id, function (err, journal:mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(journal);
                    callback(null, self.journalController.translateMongooseToJournal(journal));
                }
            });

        });
    }
    
    save(newJournal: journal.Journal, callback){
        var self = this;
        this.connection.once("open", function () {

            let journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");            
            var mongooseJournal = new journalModel();
            self.journalController.translateJournalToMongoose(newJournal, mongooseJournal);   
                     
            mongooseJournal.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.journalController.translateMongooseToJournal(result));                    
                }
            });

        });
    }
    
     update(id: string, newJournal: journal.Journal, callback){
        var self = this;
        this.connection.once("open", function () {

            let journalSchema = self.journalController.createJournalMongooseSchema();
            var journalModel = self.connection.model("journal", journalSchema, "journal");            
            var mongooseJournal = new journalModel();
            self.journalController.translateJournalToMongoose(newJournal, mongooseJournal);   
                               
            journalModel.findOneAndUpdate({"_id":mongooseJournal._id}, mongooseJournal, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.journalController.translateMongooseToJournal(result));                    
                }
            });

        });
    }
}