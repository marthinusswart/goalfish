import keyDataAccessLib = require('../../dataaccess/key/keyDataAccess');
import keyLib = require('../../models/key/key');

export class KeyService {
    keyDataAccess: keyDataAccessLib.KeyDataAccess;

    init() {
        this.keyDataAccess = new keyDataAccessLib.KeyDataAccess();
        this.keyDataAccess.init();
    }

    getNextKey(name: string, callback) {
        var filter = { name: name };
        var self = this;
        this.keyDataAccess.findByField(filter, function (err, keys: keyLib.Key[]) {
            if (err === null) {
                let key: keyLib.Key;

                if (keys.length === 0) {
                    key = new keyLib.Key;
                    key.name = name;
                    key.key = 1;
                    key.externalRef = "";

                    console.log("Created key " + key.name + " " + key.key);
                    self.keyDataAccess.save(key, function (err, key: keyLib.Key) {
                        callback(err, key);
                    });
                } else {
                    key = keys[0];

                    key.key = key.key + 1;
                    console.log("Loaded key " + key.name + " " + key.key);
                    self.keyDataAccess.update(key.externalRef, key, function (err, key: keyLib.Key) {
                        callback(err, key);
                    });
                }
            } else {
                console.log("Failed to load key");
            }
        });
    }
}