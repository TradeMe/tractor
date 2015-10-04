'use strict';

// Module:
var ControlPanel = require('../ControlPanel');

// Dependencies:
require('../../../Core/Components/Notifier/NotifierService');

var ServerStatusService = function ServerStatusService (
    NotifierService,
    RealTimeService,
    $rootScope
) {
    var serverIsRunning = false;
    monitorServerStatus();

    return {
        isServerRunning: isServerRunning
    };

    function monitorServerStatus (options) {
        RealTimeService.connect('server-status', {
            'connect': onConnect,
            'disconnect': onDisconnect
        });
    }

    function onConnect () {
        serverIsRunning = true;
        $rootScope.$apply();
    }

    function onDisconnect () {
        serverIsRunning = false;
        $rootScope.$apply();
        NotifierService.error('Tractor server stalled...');
    }

    function isServerRunning () {
        return serverIsRunning;
    }
};

ControlPanel.service('ServerStatusService', ServerStatusService);
