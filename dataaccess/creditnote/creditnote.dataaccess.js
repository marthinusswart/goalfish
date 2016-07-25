"use strict";
var mongoose = require('mongoose');
var creditnote_controller_1 = require('../../controllers/creditnote/creditnote.controller');
var BudgetDataAccess = (function () {
    function BudgetDataAccess() {
        this.wasInitialised = false;
        this.isConnectionOpen = false;
        this.isConnectionOpening = false;
    }
    BudgetDataAccess.prototype.init = function () {
        if (!this.wasInitialised) {
            var db = new mongoose.Mongoose();
            var self = this;
            this.connection = db.createConnection("localhost", "goalfish");
            this.connection.on("error", console.error.bind(console, "connection error:"));
            this.crNoteController = new creditnote_controller_1.CreditNoteController();
            this.crNoteSchema = this.crNoteController.createCreditNoteMongooseSchema();
            this.crNoteModel = this.connection.model("creditnote", this.crNoteSchema, "creditnote");
            this.isConnectionOpening = true;
            this.wasInitialised = true;
            this.connection.on("close", function () {
                self.onConnectionClose();
            });
            this.connection.on("open", function () {
                self.onConnectionOpen();
            });
        }
        else {
            throw new ReferenceError("Can't initialise again");
        }
    };
    BudgetDataAccess.prototype.find = function (memberId, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.crNoteModel.find({ memberId: memberId }, function (err, budgets) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseArrayToCreditNoteArray(budgets));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    BudgetDataAccess.prototype.findById = function (id, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var findFunc = (function () {
            self.crNoteModel.findById(id, function (err, budget) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    self.connection.close();
                    console.log(budget);
                    callback(null, self.crNoteController.translateMongooseToCreditNote(budget));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", findFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            findFunc();
        }
    };
    BudgetDataAccess.prototype.save = function (newCreditNote, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var saveFunc = (function () {
            var mongooseCrNote = new self.crNoteModel();
            self.crNoteController.translateCreditNoteToMongoose(newCreditNote, mongooseCrNote);
            mongooseCrNote.save(function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseToCreditNote(result));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", saveFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            saveFunc();
        }
    };
    BudgetDataAccess.prototype.update = function (id, newCreditNote, callback, closeConnection) {
        if (closeConnection === void 0) { closeConnection = false; }
        var self = this;
        var updateFunc = (function () {
            var mongooseCrNote = new self.crNoteModel();
            self.crNoteController.translateCreditNoteToMongoose(newCreditNote, mongooseCrNote);
            self.crNoteModel.findOneAndUpdate({ "_id": mongooseCrNote._id }, mongooseCrNote, { new: true }, function (err, result) {
                if (err) {
                    self.connection.close();
                    callback(err);
                }
                else {
                    if (closeConnection) {
                        self.connection.close();
                    }
                    callback(null, self.crNoteController.translateMongooseToCreditNote(result));
                }
            });
        });
        if (!this.isConnectionOpen && !this.isConnectionOpening) {
            this.connection.once("open", updateFunc);
            this.connection.open("localhost", "goalfish");
        }
        else {
            updateFunc();
        }
    };
    BudgetDataAccess.prototype.onConnectionOpen = function () {
        this.isConnectionOpen = true;
        this.isConnectionOpening = false;
    };
    BudgetDataAccess.prototype.onConnectionClose = function () {
        this.isConnectionOpen = false;
    };
    return BudgetDataAccess;
}());
exports.BudgetDataAccess = BudgetDataAccess;
//# sourceMappingURL=creditnote.dataaccess.js.map