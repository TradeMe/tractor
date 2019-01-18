'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var socket = require('socket.io-client');

// Module:
var Core = require('../Core');

var RealTimeService = function RealTimeService (
    config,
    $rootScope
) {
    return {
        connect: connect
    };

    function connect (room, events) {
        var url = 'http://localhost:' + config.port + '/' + room;
        var connection = socket.connect(url, {
            forceNew: true
        });
        _.each(events, function (handler, event) {
            connection.on(event, function () {
                handler.apply(this, arguments);
                $rootScope.$apply();
            });
        });
        return connection;
    }
};

Core.service('realTimeService', RealTimeService);
