import { KeyDataAccess } from '../../dataaccess/key/keyDataAccess';
import { Key } from '../../models/key/key';

export class KeyService {
    keyDataAccess: KeyDataAccess;

    init() {
        this.keyDataAccess = new KeyDataAccess();
        this.keyDataAccess.init();
    }

    getNextKey(name: string, callback) {
        var filter = { name: name };
        var self = this;
        this.keyDataAccess.findByField(filter, function (err, keys: Key[]) {
            if (err === null) {
                let key: Key;

                if (keys.length === 0) {
                    key = new Key;
                    key.name = name;
                    key.key = 1;
                    key.externalRef = "";

                    self.keyDataAccess.save(key, function (err, key: Key) {
                        callback(err, key);
                    });
                } else {
                    key = keys[0];

                    key.key = key.key + 1;
                    self.keyDataAccess.update(key.externalRef, key, function (err, key: Key) {
                        callback(err, key);
                    });
                }
            } else {
                console.log("Failed to load key");
            }
        });
    }
}