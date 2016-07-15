import express = require('express');
import { SecurityService } from '../../services/security/security.service';

let router = express.Router();
let securityService = new SecurityService();
securityService.init();

router
 .post('/login', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        securityService.login(req.body, function (err, token) {
            if (err === null) {
                res.status(201).send(token);
            }
            else {
                res.status(500).send(err.message);
            }
        });
    })
    .options('/login', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
        res.header("Content-Type", "application/json");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        res.status(200).send("OK");
    });

module.exports = router;
