"use strict";
var express = require('express');
var journalDataAccess_1 = require('../../dataaccess/journal/journalDataAccess');
var router = express.Router();
var journalDataAcccessService = new journalDataAccess_1.JournalDataAccess();
journalDataAcccessService.init();
router
    .get('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    var token = req.headers['x-access-token'];
    var memberId = token;
    var accounts = ["ACC0001", "ACC0002", "ACC0003", "ACC0004", "ACC0005"];
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
//# sourceMappingURL=journal.js.map