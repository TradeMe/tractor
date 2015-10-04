'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ControlPanel = require('./ControlPanel');

// Dependencies:
require('./Services/RunnerService');
require('./Services/ServerStatusService');

var ControlPanelController = (function () {
    var ControlPanelController = function ControlPanelController (
        RunnerService,
        ServerStatusService,
        config
    ) {
        this.runnerService = RunnerService;
        this.serverStatusService = ServerStatusService;
        this.environments = config.environments;
        this.environment = _.first(this.environments);
    };

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor({
            baseUrl: this.environment
        });
    };

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
