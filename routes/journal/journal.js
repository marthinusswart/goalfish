"use strict";
var express = require('express');
var journalDataAccess = require('../../dataaccess/journal/journalDataAccess');
var router = express.Router();
var journalDataAcccessService = new journalDataAccess.JournalDataAccess();
router
    .get('/', function (req, res, next) {
    journalDataAcccessService.init();
    journalDataAcccessService.find(function (err, journals) {
        res.status(200).send(journals);
    });
})
    .get('/:id', function (req, res, next) {
    journalDataAcccessService.init();
    journalDataAcccessService.findById(req.params.id, function (err, journal) {
        res.status(200).send(journal);
    });
})
    .put('/:id', function (req, res, next) {
    journalDataAcccessService.init();
    journalDataAcccessService.update(req.params.id, req.body, function (err, journal) {
        res.status(200).send(journal);
    });
})
    .put('/', function (req, res, next) {
    journalDataAcccessService.init();
    journalDataAcccessService.save(req.body, function (err, journal) {
        if (err === null) {
            res.status(201).send(journal);
        }
        else {
            res.status(500).send(err.message);
        }
    });
})
    .post('/ping', function (req, res, next) {
    res.status(200).send("[" + Date.now() + "] pong");
})
    .post('/longprocess', function (req, res, next) {
    res.status(200).send("[" + Date.now() + "] Not implemented yet");
});
module.exports = router;
//# sourceMappingURL=journal.js.map