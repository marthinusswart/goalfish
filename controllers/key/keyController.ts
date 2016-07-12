import mongoose = require('mongoose');
import keyLib = require('../../models/key/key');

export class KeyController {

    createKeyMongooseSchema() {
        var postingSchema = new mongoose.Schema({

            externalRef: String,
            name: String,            
            key: Number,

        });

        return postingSchema;
    }

    translateKeyToMongoose(key: keyLib.Key, mongooseKey: any) {
        mongooseKey.name = key.name;
        mongooseKey.key = key.key;       

        if (key.externalRef !== "") {
            mongooseKey._id = key.externalRef;
        } 

        return 0
    }

    translateMongooseToKey(mongooseKey: any): keyLib.Key {
        let keyObj: keyLib.Key;
        keyObj = new keyLib.Key();
        keyObj.externalRef = mongooseKey._id;
        keyObj.name = mongooseKey.name;
        keyObj.key = mongooseKey.key;

        return keyObj;
    }

    translateMongooseArrayToKeyArray(keySchemaArray) {
        var keyArray = [];
        keySchemaArray.forEach((keySchema: mongoose.Schema) => {
            keyArray.push(this.translateMongooseToKey(keySchema));
        });
        return keyArray;
    }

    

}