import express = require('express');
import models = require('../../models/posting/posting');
import postingDataAccess = require('../../dataaccess/posting/postingDataAccess');

let router = express.Router();
let postingDataAcccessService = new postingDataAccess.PostingDataAccess();

router
    .get('/', function (req, res, next) {

        postingDataAcccessService.init();
        postingDataAcccessService.find(function (err, postings) {
            res.status(200).send(postings);
        });

    })
    .get('/:id', function (req, res, next) {

        postingDataAcccessService.init();
        postingDataAcccessService.findById(req.params.id, function (err, posting) {
            res.status(200).send(posting);
        });

    })
    .put('/:id', function (req, res, next) {
        postingDataAcccessService.init();
        postingDataAcccessService.update(req.params.id, req.body, function (err, posting) {
            res.status(200).send(posting);
        });
    })
    .put('/', function (req, res, next) {
        postingDataAcccessService.init();
        postingDataAcccessService.save(req.body, function (err, posting) {
            if (err === null){
            res.status(201).send(posting);
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