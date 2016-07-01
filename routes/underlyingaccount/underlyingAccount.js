"use strict";
var express = require('express');
var underlyingAccountDataAccess = require('../../dataaccess/underlyingaccount/underlyingAccountDataAccess');
var router = express.Router();
var underlyingAccountDataAcccessService = new underlyingAccountDataAccess.UnderlyingAccountDataAccess();
router
    .get('/', function (req, res, next) {
    underlyingAccountDataAcccessService.init();
    underlyingAccountDataAcccessService.find(function (err, underlyingAccounts) {
        res.status(200).send(underlyingAccounts);
    });
})
    .get('/:id', function (req, res, next) {
    underlyingAccountDataAcccessService.init();
    underlyingAccountDataAcccessService.findById(req.params.id, function (err, underlyingAccount) {
        res.status(200).send(underlyingAccount);
    });
})
    .put('/:id', function (req, res, next) {
    underlyingAccountDataAcccessService.init();
    underlyingAccountDataAcccessService.update(req.params.id, req.body, function (err, underlyingAccount) {
        res.status(200).send(underlyingAccount);
    });
})
    .put('/', function (req, res, next) {
    underlyingAccountDataAcccessService.init();
    underlyingAccountDataAcccessService.save(req.body, function (err, underlyingAccount) {
        if (err === null) {
            res.status(201).send(underlyingAccount);
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
//# sourceMappingURL=underlyingAccount.js.map