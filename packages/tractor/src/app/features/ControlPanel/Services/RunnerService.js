'use strict';

// Module:
var ControlPanel = require('../ControlPanel');

// Dependencies:
require('../../../Core/Components/Notifier/NotifierService');

var RunnerService = function RunnerService (
    NotifierService,
    RealTimeService
) {
    return {
        runProtractor: runProtractor
    };

    function runProtractor () {
        RealTimeService.connect('run-protractor', {
            'protractor-out': notify,
            'protractor-err': notify
        });
    }

    function notify (data) {
        NotifierService[data.type](data.message);
    }
};

ControlPanel.service('RunnerService', RunnerService);
