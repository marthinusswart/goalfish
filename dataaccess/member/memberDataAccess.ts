import mongoose = require('mongoose');
import member = require('../../models/member/member');
import memberController = require('../../controllers/member/memberController');

export class MemberDataAccess {
    connection: mongoose.Connection;
    memberController: memberController.MemberController;

    init() {
        let db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.memberController = new memberController.MemberController();

    }

    find(callback) {
        var self = this;
        this.connection.once("open", function () {

            let memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            memberModel.find({}, function (err, members) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    callback(null, self.memberController.translateMongooseArrayToMemberArray(members));
                }
            });

        });
    }
    
    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            memberModel.findById(id, function (err, member:mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(member);
                    callback(null, self.memberController.translateMongooseToMember(member));
                }
            });

        });
    }
    
    save(newMember: member.Member, callback){
        var self = this;
        this.connection.once("open", function () {

            let memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");            
            var mongooseMember = new memberModel();
            self.memberController.translateMemberToMongoose(newMember, mongooseMember);   
                     
            mongooseMember.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.memberController.translateMongooseToMember(result));                    
                }
            });

        });
    }
    
     update(id: string, newMember: member.Member, callback){
        var self = this;
        this.connection.once("open", function () {

            let memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");            
            var mongooseMember = new memberModel();
            self.memberController.translateMemberToMongoose(newMember, mongooseMember);   
                               
            memberModel.findOneAndUpdate({"_id":mongooseMember._id}, mongooseMember, {new:true}, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.memberController.translateMongooseToMember(result));                    
                }
            });

        });
    }
}