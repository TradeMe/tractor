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
        runnerService,
        serverStatusService,
        config,
        plugins
    ) {
        this.runnerService = runnerService;
        this.serverStatusService = serverStatusService;

        this.environments = config.environments;
        this.plugins = plugins.filter(function (plugin) {
            return plugin.hasUI;
        });

        var environment;
        Object.defineProperty(this, 'environment', {
            get: function () {
                return environment;
            },
            set: function (newEnv) {
                environment = newEnv;
                runnerService.baseUrl = environment;
            }
        });
        this.environment = _.first(this.environments);
    }

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor();
    };

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
