'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var io = require('socket.io-client');

// Module:
var Core = require('../Core');

var RealTimeService = function RealTimeService (
    ConfigService
) {
    return {
        connect: connect
    };

    function connect (room, events) {
        ConfigService.getConfig()
        .then(function (config) {
            var url = 'http://localhost:' + config.port + '/' + room;
            var connection = io.connect(url, {
                forceNew: true
            });
            _.each(events, function (handler, event) {
                connection.on(event, handler);
            });
        });
    }
};

Core.service('RealTimeService', RealTimeService);
