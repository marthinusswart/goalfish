"use strict";
var key_dataaccess_1 = require('../../dataaccess/key/key.dataaccess');
var key_1 = require('../../models/key/key');
var KeyService = (function () {
    function KeyService() {
    }
    KeyService.prototype.init = function () {
        this.keyDataAccess = new key_dataaccess_1.KeyDataAccess();
        this.keyDataAccess.init();
    };
    KeyService.prototype.getNextKey = function (name, callback) {
        var filter = { name: name };
        var self = this;
        this.keyDataAccess.findByField(filter, function (err, keys) {
            if (err === null) {
                var key = void 0;
                if (keys.length === 0) {
                    key = new key_1.Key;
                    key.name = name;
                    key.key = 1;
                    key.externalRef = "";
                    self.keyDataAccess.save(key, function (err, key) {
                        callback(err, key);
                    });
                }
                else {
                    key = keys[0];
                    key.key = key.key + 1;
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