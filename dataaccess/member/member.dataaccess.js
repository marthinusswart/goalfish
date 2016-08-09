"use strict";
var mongoose = require('mongoose');
var memberController_1 = require('../../controllers/member/memberController');
var MemberDataAccess = (function () {
    function MemberDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpening = false;
        this.isConnectionOpen = false;
        this.dbURI = "mongodb://localhost/goalfish";
    }
    MemberDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            this.dbURI = (process.env.MONGODB_URI || "mongodb://localhost/goalfish");
            console.log("dbURI is: " + this.dbURI);
            var db = new mongoose.Mongoose();
            var self_1 = this;
            this.connection = db.createConnection(this.dbURI);
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.memberController = new memberController_1.MemberController();
            this.memberSchema = self_1.memberController.createMemberMongooseSchema();
            this.memberModel = self_1.connection.model("member", self_1.memberSchema, "member");
            this.wasInitialised = true;
            this.isConnectionOpening = true;
            this.connection.on("close", function () {
                self_1.onConnectionClose();
            });
            this.connection.on("open", function () {
                self_1.onConnectionOpen();
            });
        }
        else {
            throw new ReferenceError("Can't initialise again");
        }
    };
    MemberDataAccess.prototype.find = function (callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.memberModel.find({}, function (err, members) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.memberController.translateMongooseArrayToMemberArray(members));
                }
            });
        });
        if (!this.isConnectionOpen) {
            this.connection.once("open", findFunc);
            this.connection.open(this.dbURI);
        }
        else {
            findFunc();
        }
    };
    MemberDataAccess.prototype.findByField = function (filter, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.memberModel.find(filter, function (err, members) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.memberController.translateMongooseArrayToMemberArray(members));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open(this.dbURI);
        }
        else {
            findFunc();
        }
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
        var saveFunc = (function () {
            //let memberSchema = self.memberController.createMemberMongooseSchema();
            //var memberModel = self.connection.model("member", memberSchema, "member");
            var mongooseMember = new self.memberModel();
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
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", saveFunc);
            this.connection.open(this.dbURI);
        }
        else {
            saveFunc();
        }
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
    MemberDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    MemberDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return MemberDataAccess;
}());
exports.MemberDataAccess = MemberDataAccess;
//# sourceMappingURL=member.dataaccess.js.map