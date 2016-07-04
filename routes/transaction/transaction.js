"use strict";
var express = require('express');
var transactionDataAccess = require('../../dataaccess/transaction/transactionDataAccess');
var router = express.Router();
var transactionDataAcccessService = new transactionDataAccess.TransactionDataAccess();
router
    .get('/', function (req, res, next) {
    transactionDataAcccessService.init();
    transactionDataAcccessService.find(function (err, transactions) {
        res.status(200).send(transactions);
    });
})
    .get('/:id', function (req, res, next) {
    transactionDataAcccessService.init();
    transactionDataAcccessService.findById(req.params.id, function (err, transaction) {
        res.status(200).send(transaction);
    });
})
    .put('/:id', function (req, res, next) {
    transactionDataAcccessService.init();
    transactionDataAcccessService.update(req.params.id, req.body, function (err, transaction) {
        res.status(200).send(transaction);
    });
})
    .put('/', function (req, res, next) {
    transactionDataAcccessService.init();
    transactionDataAcccessService.save(req.body, function (err, transaction) {
        if (err === null) {
            res.status(201).send(transaction);
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
//# sourceMappingURL=transaction.js.map