import mongoose = require('mongoose');
import { Token } from '../../models/security/token';

export class SecurityController {
    createTokenMongooseSchema() {
        var tokenSchema = new mongoose.Schema({
            externalRef: String,
            token: String,
            memberId: String,
            accounts: []
        });

        return tokenSchema;
    }
}