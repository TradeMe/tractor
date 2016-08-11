'use strict';

// Module:
var ControlPanel = require('../ControlPanel');

// Dependencies:
require('../../../Core/Components/Notifier/NotifierService');

var RunnerService = function RunnerService (
    notifierService,
    realTimeService
) {
    this.baseUrl = null;

    return {
        runProtractor: runProtractor
    };

    
    function runProtractor (options) {        
        options.baseUrl =  this.baseUrl;
        var connection = realTimeService.connect('run-protractor', {
            'protractor-out': notify,
            'protractor-err': notify
        });
        connection.emit('run', options);
    }

    function notify (data) {
        notifierService[data.type](data.message);
    }
    
};

ControlPanel.service('runnerService', RunnerService);
