import express = require('express');
import models = require('../../models/budget/budget');
import { BudgetDataAccess } from '../../dataaccess/budget/budget.dataaccess';
import { BudgetService } from '../../services/budget/budget.service';
import { SecurityService } from '../../services/security/security.service';
import { Token } from '../../models/security/token';

let router = express.Router();
let budgetDataAcccessService = new BudgetDataAccess();
let budgetService = new BudgetService();
let securityService = new SecurityService();
budgetDataAcccessService.init();
budgetService.init();
securityService.init();

router
    .get('/', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        let tokenString = req.headers['x-access-token'];

        securityService.getToken(tokenString, function (err, token: Token) {
            budgetDataAcccessService.find(token.memberId, function (err, budgets) {
                res.status(200).send(budgets);
            });
        });
    })
    .get('/:id/transactions', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        let tokenString = req.headers['x-access-token'];

        securityService.getToken(tokenString, function (err, token: Token) {
            budgetDataAcccessService.loadTransactions(req.params.id, function (err, transactions) {
                res.status(200).send(transactions);
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

        let tokenString = req.headers['x-access-token'];

        securityService.getToken(tokenString, function (err, token: Token) {
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

        let tokenString = req.headers['x-access-token'];
        let budgetDeposit = req.body;

        securityService.getToken(tokenString, function (err, token: Token) {
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
     .post('/withdraw', function (req, res, next) {
        /** Not secure at all, but great for local usage only */
        res.header("Access-Control-Allow-Origin", "*");
        /** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

        let tokenString = req.headers['x-access-token'];
        let budgetWithdrawal = req.body;

        securityService.getToken(tokenString, function (err, token: Token) {
            budgetService.withdraw(token.memberId, budgetWithdrawal, function (err, budgets) {
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
     .options('/:id/transactions', function (req, res, next) {
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
     .options('/withdraw', function (req, res, next) {
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