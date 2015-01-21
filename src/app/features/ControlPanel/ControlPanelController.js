'use strict';

// Module:
var ControlPanel = require('./ControlPanel');

// Dependencies:
require('./Services/RunnerService');

var ControlPanelController = (function () {
    var ControlPanelController = function ControlPanelController (RunnerService) {
        this.runnerService = RunnerService;
    };

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
