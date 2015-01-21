'use strict';

// Config:
var config = require('../../../../server/utils/get-config')

// Utilities:
var _ = require('lodash');

// Dependencies:
var io = require('socket.io-client');

// Module:
var Core = require('../Core');

var RealTimeService = function RealTimeService () {
    return {
        connect: connect
    };

    function connect (room, events) {
        var room = io.connect('http://localhost:' + config.port + '/' + room, { forceNew: true });
        _.each(events, function (handler, name) {
            room.on(name, handler);
        });
    }
};

Core.service('RealTimeService', RealTimeService);
