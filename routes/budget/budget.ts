import express = require('express');
import models = require('../../models/budget/budget');
import budgetDataAccess = require('../../dataaccess/budget/budgetDataAccess');

let router = express.Router();
let budgetDataAcccessService = new budgetDataAccess.BudgetDataAccess();

router
    .get('/', function (req, res, next) {

        budgetDataAcccessService.init();
        budgetDataAcccessService.find(function (err, budgets) {
            res.status(200).send(budgets);
        });

    })
    .get('/:id', function (req, res, next) {

        budgetDataAcccessService.init();
        budgetDataAcccessService.findById(req.params.id, function (err, budget) {
            res.status(200).send(budget);
        });

    })
    .put('/:id', function (req, res, next) {
        budgetDataAcccessService.init();
        budgetDataAcccessService.update(req.params.id, req.body, function (err, budget) {
            res.status(200).send(budget);
        });
    })
    .put('/', function (req, res, next) {
        budgetDataAcccessService.init();
        budgetDataAcccessService.save(req.body, function (err, budget) {
            if (err === null){
            res.status(201).send(budget);
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