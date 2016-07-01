"use strict";
var mongoose = require('mongoose');
var memberController = require('../../controllers/member/memberController');
var MemberDataAccess = (function () {
    function MemberDataAccess() {
    }
    MemberDataAccess.prototype.init = function () {
        var db = new mongoose.Mongoose();
        this.connection = db.createConnection("localhost", "goalfish");
        this.connection.on("error", console.error.bind(console, "connection error:"));
        this.memberController = new memberController.MemberController();
    };
    MemberDataAccess.prototype.find = function (callback) {
        var self = this;
        this.connection.once("open", function () {
            var memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            memberModel.find({}, function (err, members) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(members);
                    callback(null, self.memberController.translateMongooseArrayToMemberArray(members));
                }
            });
        });
    };
    MemberDataAccess.prototype.findById = function (id, callback) {
        var self = this;
        this.connection.once("open", function () {
            var memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            memberModel.findById(id, function (err, member) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(member);
                    callback(null, self.memberController.translateMongooseToMember(member));
                }
            });
        });
    };
    MemberDataAccess.prototype.save = function (newMember, callback) {
        var self = this;
        this.connection.once("open", function () {
            var memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            var mongooseMember = new memberModel();
            self.memberController.translateMemberToMongoose(newMember, mongooseMember);
            mongooseMember.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.memberController.translateMongooseToMember(result));
                }
            });
        });
    };
    MemberDataAccess.prototype.update = function (id, newMember, callback) {
        var self = this;
        this.connection.once("open", function () {
            var memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            var mongooseMember = new memberModel();
            self.memberController.translateMemberToMongoose(newMember, mongooseMember);
            memberModel.findOneAndUpdate({ "_id": mongooseMember._id }, mongooseMember, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(result);
                    callback(null, self.memberController.translateMongooseToMember(result));
                }
            });
        });
    };
    return MemberDataAccess;
}());
exports.MemberDataAccess = MemberDataAccess;
//# sourceMappingURL=memberDataAccess.js.map