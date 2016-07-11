"use strict";
var express = require('express');
var journalServiceLib = require('../../services/maintenance/journal.service');
var router = express.Router();
var journalMaintenanceService = new journalServiceLib.JournalMaintenanceService();
router
    .post('/journal/markAllAsPosted', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    journalMaintenanceService.init();
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