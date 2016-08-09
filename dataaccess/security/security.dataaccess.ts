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
     dbURI = "mongodb://localhost/goalfish"; 

    init() {
        if (!this.wasInitialised) {
            this.dbURI =  (process.env.MONGODB_URI || "mongodb://localhost/goalfish");  
            let db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection(this.dbURI);
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.securityController = new SecurityController();

            this.tokenSchema = this.securityController.createTokenMongooseSchema();
            this.tokenModel = this.connection.model("token", this.tokenSchema, "token");

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

    saveToken(token: Token, callback, closeConnection: boolean = false) {
        var self = this;
        var saveFunc = (function () {

            let tokenMongoose = new self.tokenModel()
            self.securityController.convertTokenToMongoose(token, tokenMongoose);

            tokenMongoose.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    token.token = tokenMongoose._id;
                    callback(null, token);
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

    findById(id: string, callback, closeConnection: boolean = false) {
        var self = this;
        var findFunc = (function () {

            self.tokenModel.findById(id, function (err, token: mongoose.Schema) {
                if (err) {
                    self.connection.close();
                    callback(err);
                } else {
                    if (closeConnection) {
                        self.connection.close()
                    }
                                       
                    callback(null, self.securityController.translateMongooseToToken(token));
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

    onConnectionOpen() {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    }

    onConnectionClose() {
        this.isConnectionOpen = false;
    }
}
