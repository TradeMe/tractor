'use strict';

// Utilities:
var _ = require('lodash');
var log = require('../utils/logging');
var path = require('path');

// Config:
var config = require('../utils/get-config')();
var protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
var e2ePath = path.join(config.testDirectory, 'protractor.conf.js');

// Dependencies:
var childProcess = require('child_process');
var stripcolorcodes = require('stripcolorcodes');
var trim = require('trim');

module.exports = setupProtractorListener;

function setupProtractorListener (sockets) {
    sockets.of('/run-protractor')
    .on('connection', runProtractor);
}

function runProtractor (socket) {
    var protractor = childProcess.spawn('node', [protractorPath, e2ePath]);

    protractor.stdout.on('data', _.bind(sendDataToClient, socket));
    protractor.stderr.on('data', _.bind(sendErrorToClient, socket));
    protractor.on('exit', function () {
        socket.disconnect();
    });
}

function sendDataToClient (data) {
    data = formatData(trim(stripcolorcodes(data.toString())));
    if (data.length) {
        log.info(data);
        this.emit('protractor-out', data);
    }
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

function sendErrorToClient (data) {
    data = trim(stripcolorcodes(data.toString()));
    if (data.length) {
        log.error(data);
        this.emit('protractor-err', data);
    }
}
