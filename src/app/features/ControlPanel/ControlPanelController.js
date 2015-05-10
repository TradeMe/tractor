'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ControlPanel = require('./ControlPanel');

// Dependencies:
require('./Services/RunnerService');

var ControlPanelController = (function () {
    var ControlPanelController = function ControlPanelController (
        RunnerService,
        config
    ) {
        this.runnerService = RunnerService;
        this.environments = config.environments;
        this.environment = _.first(this.environments);
    };

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor({
            baseUrl: this.environment
        });
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
