"use strict";
var express = require('express');
var initiativeDataAccess_1 = require('../../dataaccess/initiative/initiativeDataAccess');
var initiativeServiceLib = require('../../services/initiative/initiative.service');
var security_service_1 = require('../../services/security/security.service');
var router = express.Router();
var initiativeDataAcccessService = new initiativeDataAccess_1.InitiativeDataAccess();
var initiativeService = new initiativeServiceLib.InitativeService();
var securityService = new security_service_1.SecurityService();
initiativeDataAcccessService.init();
initiativeService.init();
securityService.init();
router
    .get('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    var tokenString = req.headers['x-access-token'];
    securityService.getToken(tokenString, function (err, token) {
        initiativeDataAcccessService.find(token.memberId, function (err, initiatives) {
            res.status(200).send(initiatives);
        });
    });
})
    .get('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    initiativeDataAcccessService.findById(req.params.id, function (err, initiative) {
        res.status(200).send(initiative);
    });
})
    .put('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    initiativeDataAcccessService.update(req.params.id, req.body, function (err, initiative) {
        res.status(200).send(initiative);
    });
})
    .post('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    initiativeDataAcccessService.save(req.body, function (err, initiative) {
        if (err === null) {
            res.status(201).send(initiative);
        }
        else {
            res.status(500).send(err.message);
        }
    });
})
    .post('/reconcile', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    initiativeService.reconcileInitiatives(function (err, initiatives) {
        if (err === null) {
            res.status(200).send(initiatives);
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
    .options('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
    res.header("Content-Type", "application/json");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("OK");
})
    .options('/reconcile', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
    res.header("Content-Type", "application/json");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("OK");
})
    .post('/ping', function (req, res, next) {
    res.status(200).send("[" + Date.now() + "] pong");
})
    .post('/longprocess', function (req, res, next) {
    res.status(200).send("[" + Date.now() + "] Not implemented yet");
});
module.exports = router;
//# sourceMappingURL=initiative.js.map