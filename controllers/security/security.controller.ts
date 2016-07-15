import mongoose = require('mongoose');
import { Token } from '../../models/security/token';

export class SecurityController {

    createTokenMongooseSchema() {
        let tokenSchema = new mongoose.Schema({
            token: String,
            memberId: String,
            accounts: []
        });

        return tokenSchema;
    }

    convertTokenToMongoose(token: Token, mongooseToken: any) {
        mongooseToken.token = token.token;
        mongooseToken.memberId = token.memberId;
        mongooseToken.accounts = token.accounts;
    }

    translateMongooseToToken(mongooseToken: any): Token{
        let token = new Token();
        token.token = mongooseToken._id;
        token.memberId = mongooseToken.memberId;
        token.accounts = mongooseToken.accounts;

        return token;
    }
}