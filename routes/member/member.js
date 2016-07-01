"use strict";
var express = require('express');
var memberDataAccess = require('../../dataaccess/member/memberDataAccess');
var router = express.Router();
var memberDataAcccessService = new memberDataAccess.MemberDataAccess();
router
    .get('/', function (req, res, next) {
    memberDataAcccessService.init();
    memberDataAcccessService.find(function (err, members) {
        res.status(200).send(members);
    });
})
    .get('/:id', function (req, res, next) {
    memberDataAcccessService.init();
    memberDataAcccessService.findById(req.params.id, function (err, member) {
        res.status(200).send(member);
    });
})
    .put('/:id', function (req, res, next) {
    memberDataAcccessService.init();
    memberDataAcccessService.update(req.params.id, req.body, function (err, member) {
        res.status(200).send(member);
    });
})
    .put('/', function (req, res, next) {
    memberDataAcccessService.init();
    memberDataAcccessService.save(req.body, function (err, member) {
        if (err === null) {
            res.status(201).send(member);
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
//# sourceMappingURL=member.js.map