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
        $scope
    ) {
        this.runnerService = runnerService;
        this.serverStatusService = serverStatusService;
        this.environments = config.environments;
        this.environment = _.first(this.environments);       
        $scope.$watch('controlPanel.environment', function (newEnvironmentValue, oldEnvironmentValue) {
                if (newEnvironmentValue !== oldEnvironmentValue){
                        runnerService.setSelectedUrl(newEnvironmentValue);    
                }
        }) 
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
