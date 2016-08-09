import mongoose = require('mongoose');
import { Member } from '../../models/member/member';
import { MemberController } from '../../controllers/member/memberController';

export class MemberDataAccess {
    connection: mongoose.Connection;
    memberController: MemberController;
    memberSchema: any;
    memberModel: any;
    wasInitialised: boolean = false;
    isConnectionOpening: boolean = false;
    isConnectionOpen: boolean = false;
    dbURI = "mongodb://localhost/goalfish"; 

    init() {
        if (!this.wasInitialised) {
            this.dbURI =  (process.env.MONGODB_URI || "mongodb://localhost/goalfish");
            console.log("dbURI is: " + this.dbURI);            
            let db = new mongoose.Mongoose();
            let self = this;
            this.connection = db.createConnection(this.dbURI);
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.memberController = new MemberController();
            this.memberSchema = self.memberController.createMemberMongooseSchema();
            this.memberModel = self.connection.model("member", self.memberSchema, "member");
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

    find(callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {


            self.memberModel.find({}, function (err, members) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    findByField(filter: any, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.memberModel.find(filter, function (err, members) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
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
        } else {
            findFunc();
        }
    }

    findById(id: string, callback) {
        var self = this;
        this.connection.once("open", function () {

            let memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            memberModel.findById(id, function (err, member: mongoose.Schema) {
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

    save(newMember: Member, callback) {
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
                } else {
                    self.connection.close()
                    console.log(result);
                    callback(null, self.memberController.translateMongooseToMember(result));
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

    update(id: string, newMember: Member, callback) {
        var self = this;
        this.connection.once("open", function () {

            let memberSchema = self.memberController.createMemberMongooseSchema();
            var memberModel = self.connection.model("member", memberSchema, "member");
            var mongooseMember = new memberModel();
            self.memberController.translateMemberToMongoose(newMember, mongooseMember);

            memberModel.findOneAndUpdate({ "_id": mongooseMember._id }, mongooseMember, { new: true }, function (err, result) {
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

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}