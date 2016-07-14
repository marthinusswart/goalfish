import mongoose = require('mongoose');
import { Token } from '../../models/security/token';
import { SecurityController } from '../../controllers/security/security.controller';

export class SecurityDataAccess {
    connection: mongoose.Connection;
    securityController: SecurityController;
    wasInitialised: boolean = false;
    isConnectionOpening: boolean = false;
    isConnectionOpen: boolean = false;
    tokenSchema: any;
    tokenModel: any;
    mongooseToken: any;

    init() {
        if (!this.wasInitialised) {
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.securityController = new SecurityController();

            this.tokenSchema = this.securityController.createTokenMongooseSchema();
            this.tokenModel = this.connection.model("token", this.tokenSchema, "token");
            this.mongooseToken = new this.tokenModel();

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

     onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}
