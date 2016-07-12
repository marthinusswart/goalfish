"use strict";
var keyDataAccessLib = require('../../dataaccess/key/keyDataAccess');
var keyLib = require('../../models/key/key');
var KeyService = (function () {
    function KeyService() {
    }
    KeyService.prototype.init = function () {
        this.keyDataAccess = new keyDataAccessLib.KeyDataAccess();
        this.keyDataAccess.init();
    };
    KeyService.prototype.getNextKey = function (name, callback) {
        var filter = { name: name };
        var self = this;
        this.keyDataAccess.findByField(filter, function (err, keys) {
            if (err === null) {
                var key = void 0;
                if (keys.length === 0) {
                    key = new keyLib.Key;
                    key.name = name;
                    key.key = 1;
                    key.externalRef = "";
                    console.log("Created key " + key.name + " " + key.key);
                    self.keyDataAccess.save(key, function (err, key) {
                        callback(err, key);
                    });
                }
                else {
                    key = keys[0];
                    key.key = key.key + 1;
                    console.log("Loaded key " + key.name + " " + key.key);
                    self.keyDataAccess.update(key.externalRef, key, function (err, key) {
                        callback(err, key);
                    });
                }
            }
            else {
                console.log("Failed to load key");
            }
        });
    };
    return KeyService;
}());
exports.KeyService = KeyService;
//# sourceMappingURL=key.service.js.map