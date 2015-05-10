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

    function runProtractor (options) {
        RealTimeService.connect('run-protractor', {
            'protractor-out': notify,
            'protractor-err': notify
        })
        .then(function (connection) {
            connection.emit('run', options);
        });
    }

    function notify (data) {
        NotifierService[data.type](data.message);
    }
};

ControlPanel.service('RunnerService', RunnerService);
