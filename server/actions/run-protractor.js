'use strict';

// Config:
var config = require('../utils/get-config');

// Dependencies:
var path = require('path');
var spawn = require('child_process').spawn;
var stripcolorcodes = require('stripcolorcodes');
var trim = require('trim');

module.exports = function (sockets) {
    var protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
    var e2ePath = path.join(config.testDirectory, 'protractor.conf.js');

    sockets.of('/run-protractor')
    .on('connection', runProtractorConnection);

    function runProtractorConnection (socket) {
        var protractor = spawn('node', [protractorPath, e2ePath]);

        protractor.stdout.on('data', function (data) {
            data = formatData(trim(stripcolorcodes(data.toString())));
            if (data.length) {
                console.log(data);
                socket.emit('protractor-out', data);
            }
        });

        protractor.stderr.on('data', function (data) {
            data = trim(stripcolorcodes(data.toString()));
            if (data.length) {
                console.log(data);
                socket.emit('protractor-err', data);
            }
        });

        protractor.on('exit', function () {
            socket.disconnect();
        });
    }

    function formatData (data) {
        // Remove line numbers from step definitions:
        data = data.replace(/\s*?# .*/g, '...');
        // Trim leading whitespace from scenario outlines:
        data = data.replace(/^\s*/gm, '');
        // Remove server URL:
        data = data.replace(/ at http.*/g, '.');
        return data;
    }
};
