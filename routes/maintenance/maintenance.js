"use strict";
var express = require('express');
var journalServiceLib = require('../../services/maintenance/journal.service');
var trxServiceLib = require('../../services/maintenance/transaction.service');
var router = express.Router();
var journalMaintenanceService = new journalServiceLib.JournalMaintenanceService();
var trxMaintenanceService = new trxServiceLib.TransactionMaintenanceService();
journalMaintenanceService.init();
trxMaintenanceService.init();
router
    .post('/journal/markAllAsPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    journalMaintenanceService.markAllAsPosted(function (err) {
        if (err === null) {
            res.status(200).send("OK");
        }
        else {
            res.status(500).send("FAILED");
        }
    });
})
    .options('/journal/markAllAsPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept");
    res.header("Content-Type", "application/json");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("OK");
})
    .post('/journal/markAllAsNotPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    journalMaintenanceService.markAllAsNotPosted(function (err) {
        if (err === null) {
            res.status(200).send("OK");
        }
        else {
            res.status(500).send("FAILED");
        }
    });
})
    .options('/journal/markAllAsNotPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept");
    res.header("Content-Type", "application/json");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("OK");
})
    .post('/transaction/markAllAsPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    trxMaintenanceService.markAllAsPosted(function (err) {
        if (err === null) {
            res.status(200).send("OK");
        }
        else {
            res.status(500).send("FAILED");
        }
    });
})
    .options('/transaction/markAllAsPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept");
    res.header("Content-Type", "application/json");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("OK");
})
    .post('/transaction/markAllAsNotPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    trxMaintenanceService.markAllAsNotPosted(function (err) {
        if (err === null) {
            res.status(200).send("OK");
        }
        else {
            res.status(500).send("FAILED");
        }
    });
})
    .options('/transaction/markAllAsNotPosted', function (req, res, next) {
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
//# sourceMappingURL=maintenance.js.map