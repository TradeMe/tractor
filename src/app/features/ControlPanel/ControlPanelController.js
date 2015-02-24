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
        ConfigService
    ) {
        this.runnerService = RunnerService;

        ConfigService.getConfig()
        .then(_.bind(function (config) {
            this.appRootUrl = config.appRootUrl;
        }, this));
    };

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
