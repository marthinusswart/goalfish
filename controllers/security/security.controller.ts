import mongoose = require('mongoose');
import { Token } from '../../models/security/token';

export class SecurityController {

    createTokenMongooseSchema() {
        let tokenSchema = new mongoose.Schema({
            externalRef: String,
            token: String,
            memberId: String,
            accounts: []
        });

        return tokenSchema;
    }

    convertTokenToMongoose(token: Token, mongooseToken: any) {
        mongooseToken.token = token.token;
        mongooseToken.memberIf = token.memberId;
        mongooseToken.accounts = token.accounts;
    }
}