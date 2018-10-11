'use strict';

// Module:
var ControlPanel = require('../ControlPanel');

// Dependencies:
require('../../../Core/Components/Notifier/NotifierService');
require('../../../Core/Services/RealtimeService');

var ServerStatusService = function ServerStatusService (
    notifierService,
    realTimeService,
    $rootScope
) {
    var serverIsRunning = false;
    monitorServerStatus();

    return {
        isServerRunning: isServerRunning
    };

    function monitorServerStatus () {
        realTimeService.connect('server-status', {
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
        notifierService.error('Tractor server stalled...');
    }

    function isServerRunning () {
        return serverIsRunning;
    }
};

ControlPanel.service('serverStatusService', ServerStatusService);
