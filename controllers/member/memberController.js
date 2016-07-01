"use strict";
var mongoose = require('mongoose');
var member = require('../../models/member/member');
var MemberController = (function () {
    function MemberController() {
    }
    MemberController.prototype.createMemberMongooseSchema = function () {
        var memberSchema = new mongoose.Schema({
            id: String,
            salutation: String,
            name: String,
            surname: String,
            email: String
        });
        return memberSchema;
    };
    MemberController.prototype.translateMemberToMongoose = function (member, mongooseMember) {
        mongooseMember.id = member.id;
        mongooseMember.name = member.name;
        mongooseMember.surname = member.surname;
        mongooseMember.salutation = member.salutation;
        mongooseMember.email = member.email;
        if (member.externalRef !== "") {
            mongooseMember._id = member.externalRef;
        }
        return 0;
    };
    MemberController.prototype.translateMongooseToMember = function (mongooseMember) {
        var memberObj;
        memberObj = new member.Member();
        memberObj.externalRef = mongooseMember._id;
        memberObj.name = mongooseMember.name;
        memberObj.surname = mongooseMember.surname;
        memberObj.salutation = mongooseMember.salutation;
        memberObj.email = mongooseMember.email;
        memberObj.id = mongooseMember.id;
        return memberObj;
    };
    MemberController.prototype.translateMongooseArrayToMemberArray = function (memberSchemaArray) {
        var _this = this;
        var memberArray = [];
        memberSchemaArray.forEach(function (memberSchema) {
            memberArray.push(_this.translateMongooseToMember(memberSchema));
        });
        return memberArray;
    };
    return MemberController;
}());
exports.MemberController = MemberController;
//# sourceMappingURL=memberController.js.map