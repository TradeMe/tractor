'use strict';

// Module:
var Core = require('../../Core');

var ConfirmDialogController = (function () {
    var ConfirmDialogController = function ConfirmDialogController () { };

    ConfirmDialogController.prototype.ok = function () {
        this.trigger.resolve();
    };

    ConfirmDialogController.prototype.cancel = function () {
        this.trigger.reject();
    };

    return ConfirmDialogController;
})();

Core.controller('ConfirmDialogController', ConfirmDialogController);
