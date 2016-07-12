import express = require('express');
import models = require('../../models/posting/posting');
import postingDataAccess = require('../../dataaccess/posting/postingDataAccess');
import postingServiceLib = require('../../services/posting/posting.service');

let router = express.Router();
let postingDataAcccessService = new postingDataAccess.PostingDataAccess();
let postingService = new postingServiceLib.PostingService();
postingDataAcccessService.init();

router
    .get('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        
        postingDataAcccessService.find(function (err, postings) {
            res.status(200).send(postings);
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
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept");
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
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept");
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
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept");
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