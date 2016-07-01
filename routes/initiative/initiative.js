"use strict";
var express = require('express');
var initiativeDataAccess = require('../../dataaccess/initiative/initiativeDataAccess');
var router = express.Router();
var initiativeDataAcccessService = new initiativeDataAccess.InitiativeDataAccess();
router
    .get('/', function (req, res, next) {
    initiativeDataAcccessService.init();
    initiativeDataAcccessService.find(function (err, initiatives) {
        res.status(200).send(initiatives);
    });
})
    .get('/:id', function (req, res, next) {
    initiativeDataAcccessService.init();
    initiativeDataAcccessService.findById(req.params.id, function (err, initiative) {
        res.status(200).send(initiative);
    });
})
    .put('/:id', function (req, res, next) {
    initiativeDataAcccessService.init();
    initiativeDataAcccessService.update(req.params.id, req.body, function (err, initiative) {
        res.status(200).send(initiative);
    });
})
    .put('/', function (req, res, next) {
    initiativeDataAcccessService.init();
    initiativeDataAcccessService.save(req.body, function (err, initiative) {
        if (err === null) {
            res.status(201).send(initiative);
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
//# sourceMappingURL=initiative.js.map