"use strict";
var express = require('express');
var creditnote_dataaccess_1 = require('../../dataaccess/creditnote/creditnote.dataaccess');
var creditnote_service_1 = require('../../services/creditnote/creditnote.service');
var security_service_1 = require('../../services/security/security.service');
var router = express.Router();
var crNoteDataAcccessService = new creditnote_dataaccess_1.CreditNoteDataAccess();
var crNoteService = new creditnote_service_1.CreditNoteService();
var securityService = new security_service_1.SecurityService();
crNoteDataAcccessService.init();
crNoteService.init();
securityService.init();
router
    .get('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    var tokenString = req.headers['x-access-token'];
    securityService.getToken(tokenString, function (err, token) {
        crNoteDataAcccessService.find(token.memberId, function (err, creditNotes) {
            res.status(200).send(creditNotes);
        });
    });
})
    .get('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    crNoteDataAcccessService.findById(req.params.id, function (err, creditNote) {
        res.status(200).send(creditNote);
    });
})
    .put('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    crNoteDataAcccessService.update(req.params.id, req.body, function (err, creditNote) {
        res.status(200).send(creditNote);
    });
})
    .post('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    crNoteDataAcccessService.save(req.body, function (err, creditNote) {
        if (err === null) {
            res.status(201).send(creditNote);
        }
        else {
            res.status(500).send(err.message);
        }
    });
})
    .post('/ping', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("[" + Date.now() + "] pong");
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
    .post('/longprocess', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("[" + Date.now() + "] Not implemented yet");
});
module.exports = router;
//# sourceMappingURL=creditnote.js.map