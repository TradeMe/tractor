'use strict';

// Module:
var ControlPanel = require('../ControlPanel');
var Terminal = require('xterm');
require('xterm/lib/addons/fit');

// Dependencies:
require('../../../Core/Components/Notifier/NotifierService');

var RunnerService = function RunnerService (
    notifierService,
    realTimeService
) {
    var term = new Terminal({
        tabStopWidth: 4
    });
    term.open(document.getElementById('terminal'), false);
    term.fit();

    this.baseUrl = null;

    return {
        runProtractor: runProtractor
    };

    function runProtractor (options) {
        term.clear();
        options = options || {};
        options.baseUrl = this.baseUrl;
        var connection = realTimeService.connect('run-protractor', {
            'protractor-out': log
        });
        connection.emit('run', options);
    }

    function log (data) {
        data = data.replace(/\n/g, '\r\n');
        console.log(data);
        term.write(data);
    }
};

ControlPanel.service('runnerService', RunnerService);
