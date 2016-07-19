"use strict";
var express = require('express');
var budgetDataAccess_1 = require('../../dataaccess/budget/budgetDataAccess');
var budget_service_1 = require('../../services/budget/budget.service');
var security_service_1 = require('../../services/security/security.service');
var router = express.Router();
var budgetDataAcccessService = new budgetDataAccess_1.BudgetDataAccess();
var budgetService = new budget_service_1.BudgetService();
var securityService = new security_service_1.SecurityService();
budgetDataAcccessService.init();
budgetService.init();
securityService.init();
router
    .get('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    var tokenString = req.headers['x-access-token'];
    securityService.getToken(tokenString, function (err, token) {
        budgetDataAcccessService.find(token.memberId, function (err, budgets) {
            res.status(200).send(budgets);
        });
    });
})
    .get('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    budgetDataAcccessService.findById(req.params.id, function (err, budget) {
        res.status(200).send(budget);
    });
})
    .put('/:id', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    budgetDataAcccessService.update(req.params.id, req.body, function (err, budget) {
        res.status(200).send(budget);
    });
})
    .post('/', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    budgetDataAcccessService.save(req.body, function (err, budget) {
        if (err === null) {
            res.status(201).send(budget);
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
    var tokenString = req.headers['x-access-token'];
    securityService.getToken(tokenString, function (err, token) {
        budgetService.reconcileBudgets(token.memberId, function (err, budgets) {
            if (err === null) {
                res.status(200).send(budgets);
            }
            else {
                res.status(500).send(err.message);
            }
        });
    });
})
    .post('/deposit', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    var tokenString = req.headers['x-access-token'];
    var budgetDeposit = req.body;
    securityService.getToken(tokenString, function (err, token) {
        budgetService.deposit(token.memberId, budgetDeposit, function (err, budgets) {
            if (err === null) {
                res.status(200).send(budgets);
            }
            else {
                res.status(500).send(err.message);
            }
        });
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
    .options('/reconcile', function (req, res, next) {
    /** Not secure at all, but great for local usage only */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization,Accept,x-access-token");
    res.header("Content-Type", "application/json");
    /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
    res.status(200).send("OK");
})
    .options('/deposit', function (req, res, next) {
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
//# sourceMappingURL=budget.js.map