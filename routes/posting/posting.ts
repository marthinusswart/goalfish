import express = require('express');
//import models = require('../../models/posting/posting');
import { PostingDataAccess } from '../../dataaccess/posting/postingDataAccess';
import { PostingService } from '../../services/posting/posting.service';
import { SecurityService } from '../../services/security/security.service';
import { Token } from '../../models/security/token';

let router = express.Router();
let postingDataAcccessService = new PostingDataAccess();
let postingService = new PostingService();
let securityService = new SecurityService();
postingDataAcccessService.init();
securityService.init();

router
    .get('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        let tokenString = req.headers['x-access-token'];

        securityService.getToken(tokenString, function (err, token: Token) {
            postingDataAcccessService.find(token.accounts, function (err, postings) {
                res.status(200).send(postings);
            });
        });

    })
    .get('/:id', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        postingDataAcccessService.findById(req.params.id, function (err, posting) {
            res.status(200).send(posting);
        });

    })
    .put('/:id', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        postingDataAcccessService.update(req.params.id, req.body, function (err, posting) {
            res.status(200).send(posting);
        });
    })
    .post('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        postingDataAcccessService.save(req.body, function (err, posting) {
            if (err === null) {
                res.status(201).send(posting);
            }
            else {
                res.status(500).send(err.message);
            }
        });
    })
    .options('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
        res.header("Content-Type", "application/json");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        res.status(200).send("OK");
    })
    .post('/process/journals', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        postingService.processJournals(function (err, posting) {
            if (err === null) {
                res.status(200).send("OK");
            }
            else {
                res.status(500).send(err.message);
            }
        });
    })
    .options('/process/journals', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
        res.header("Content-Type", "application/json");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        res.status(200).send("OK");
    })
    .post('/process/transactions', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        postingService.processTransactions(function (err, posting) {
            if (err === null) {
                res.status(200).send("OK");
            }
            else {
                res.status(500).send(err.message);
            }
        });
    })
    .options('/process/transactions', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
        res.header("Content-Type", "application/json");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        res.status(200).send("OK");
    })
    .post('/ping', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        res.status(200).send("[" + Date.now() + "] pong");
    })
    .post('/longprocess', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        res.status(200).send("[" + Date.now() + "] Not implemented yet");
    });

module.exports = router;