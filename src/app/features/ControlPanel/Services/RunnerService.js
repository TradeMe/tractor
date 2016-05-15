'use strict';

// Module:
var ControlPanel = require('../ControlPanel');

// Dependencies:
require('../../../Core/Components/Notifier/NotifierService');

var RunnerService = function RunnerService (
    notifierService,
    realTimeService
) {
    var configEnv; 
    return {
        runProtractor: runProtractor,        
        getConfigEnv: getConfigEnv,
        setConfigEnv: setConfigEnv
    };

    function runProtractor (options) {
        var connection = realTimeService.connect('run-protractor', {
            'protractor-out': notify,
            'protractor-err': notify
        });
        connection.emit('run', options);
    }

    function notify (data) {
        notifierService[data.type](data.message);
    }
    
    function getConfigEnv() {
        return configEnv;        
    }
    
    function setConfigEnv(envSelected) {
        return configEnv = envSelected;  
    }
    
};

ControlPanel.service('runnerService', RunnerService);
