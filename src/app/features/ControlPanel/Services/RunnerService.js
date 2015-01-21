'use strict';

// Module:
var ControlPanel = require('../ControlPanel');

// Dependencies:
require('../../Notifier/Services/NotifierService');

var RunnerService = function RunnerService (
    NotifierService,
    RealTimeService
) {
    return {
        runProtractor: runProtractor
    };

    function runProtractor () {
        RealTimeService.connect('run-protractor', {
            'protractor-out': protractorOut,
            'protractor-err': protractorErr
        });
    }

    function protractorOut (data) {
        NotifierService.info(data);
    }

    function protractorErr (data) {
        NotifierService.error(data);
    }
};

ControlPanel.service('RunnerService', RunnerService);
