import mongoose = require('mongoose');
import member = require('../../models/member/member');

export class MemberController {

    createMemberMongooseSchema() {
        var memberSchema = new mongoose.Schema({
            id: String,
            salutation: String,
            name: String,
            surname: String,
            email: String
        });

        return memberSchema;
    }

    translateMemberToMongoose(member: member.Member, mongooseMember: any) {
        mongooseMember.id = member.id;
        mongooseMember.name = member.name;
        mongooseMember.surname = member.surname;
        mongooseMember.salutation = member.salutation;
        mongooseMember.email = member.email;

        if (member.externalRef !== "") {
            mongooseMember._id = member.externalRef;
        }

        return 0
    }

    translateMongooseToMember(mongooseMember: any): member.Member {
        let memberObj: member.Member;
        memberObj = new member.Member();
        memberObj.externalRef = mongooseMember._id;
        memberObj.name = mongooseMember.name;
        memberObj.surname = mongooseMember.surname;
        memberObj.salutation = mongooseMember.salutation;
        memberObj.email = mongooseMember.email;
        memberObj.id = mongooseMember.id;


        return memberObj;
    }

    translateMongooseArrayToMemberArray(memberSchemaArray) {
        var memberArray = [];
        memberSchemaArray.forEach((memberSchema: mongoose.Schema) => {
            memberArray.push(this.translateMongooseToMember(memberSchema));
        });
        return memberArray;
    }

}