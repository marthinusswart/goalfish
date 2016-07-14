import express = require('express');
import models = require('../../models/journal/journal');
import { JournalDataAccess } from '../../dataaccess/journal/journalDataAccess';

let router = express.Router();
let journalDataAcccessService = new JournalDataAccess();
journalDataAcccessService.init();

router
    .get('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        
        let token = req.headers['x-access-token'];
        let memberId = token;
        let accounts:string[] = ["ACC0001","ACC0002","ACC0003","ACC0004","ACC0005"];
        journalDataAcccessService.find(accounts, function (err, journals) {
            res.status(200).send(journals);
        });

    })
    .get('/:id', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        
        journalDataAcccessService.findById(req.params.id, function (err, journal) {
            res.status(200).send(journal);
        });

    })
    .put('/:id', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        
        journalDataAcccessService.update(req.params.id, req.body, function (err, journal) {
            res.status(200).send(journal);
        });
    })
    .post('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
        
        journalDataAcccessService.save(req.body, function (err, journal) {
            if (err === null) {
                res.status(201).send(journal);
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
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept, x-access-token");
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