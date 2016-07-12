"use strict";
var mongoose = require('mongoose');
var keyLib = require('../../models/key/key');
var KeyController = (function () {
    function KeyController() {
    }
    KeyController.prototype.createKeyMongooseSchema = function () {
        var postingSchema = new mongoose.Schema({
            externalRef: String,
            name: String,
            key: Number,
        });
        return postingSchema;
    };
    KeyController.prototype.translateKeyToMongoose = function (key, mongooseKey) {
        mongooseKey.name = key.name;
        mongooseKey.key = key.key;
        if (key.externalRef !== "") {
            mongooseKey._id = key.externalRef;
        }
        return 0;
    };
    KeyController.prototype.translateMongooseToKey = function (mongooseKey) {
        var keyObj;
        keyObj = new keyLib.Key();
        keyObj.externalRef = mongooseKey._id;
        keyObj.name = mongooseKey.name;
        keyObj.key = mongooseKey.key;
        return keyObj;
    };
    KeyController.prototype.translateMongooseArrayToKeyArray = function (keySchemaArray) {
        var _this = this;
        var keyArray = [];
        keySchemaArray.forEach(function (keySchema) {
            keyArray.push(_this.translateMongooseToKey(keySchema));
        });
        return keyArray;
    };
    return KeyController;
}());
exports.KeyController = KeyController;
//# sourceMappingURL=keyController.js.map