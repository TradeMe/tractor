'use strict';

// Utilities:
var _ = require('lodash');
var log = require('../utils/logging');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/create-config')();
var protractorPath = path.join('node_modules', 'protractor', 'bin', 'protractor');
var e2ePath = path.join(config.testDirectory, 'protractor.conf.js');

// Dependencies:
var childProcess = require('child_process');
var stripcolorcodes = require('stripcolorcodes');
var trim = require('trim');

// Errors:
var ProtractorRunError = require('../errors/ProtractorRunError');

module.exports = runProtractor;

function runProtractor (socket) {
    if (!module.exports.running) {
        module.exports.running = true;

        return Promise.resolve(config.beforeProtractor())
        .then(function () {
            log.important('Starting Protractor...\n');
            return startProtractor(socket);
        })
        .catch(function (error) {
            socket.lastMessage = socket.lastMessage || '';
            log.error(error.message + _.first(socket.lastMessage.split(/\r\n|\n/)));
        })
        .finally(function () {
            socket.disconnect();
            return Promise.resolve(config.afterProtractor())
            .then(function () {
                module.exports.running = false;
                log.info('Protractor finished.');
            });
        });
    } else {
        log.error('Protractor already running.');
        return Promise.reject(new ProtractorRunError('Protractor already running.'));
    }
}

function startProtractor (socket) {
    var resolve;
    var reject;
    var deferred = new Promise(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });

    var protractor = childProcess.spawn('node', [protractorPath, e2ePath]);

    protractor.stdout.on('data', sendDataToClient.bind(socket));
    protractor.stderr.on('data', sendErrorToClient.bind(socket));
    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);

    protractor.on('error', function (error) {
        reject(new ProtractorRunError(error.message));
    });
    protractor.on('exit', function (code) {
        if (code !== 0) {
            reject(new ProtractorRunError('Protractor Exit Error - '));
        } else {
            resolve();
        }
    });
    return deferred;
}

function sendDataToClient (data) {
    this.lastMessage = data.toString();
    var messages = data.toString().split(/\r\n|\n/);
    messages.forEach(function (message) {
        data = formatMessage(trim(stripcolorcodes(message)));
        if (data && data.message.length) {
            this.emit('protractor-out', data);
        }
    }.bind(this));
}

function formatMessage (message) {
    // If it looks like an error:
    if (message.match(/Error\:/)) {
        return {
            message: message,
            type: 'error'
        };
    }

    // Remove line numbers from step definitions:
    message = message.replace(/\s*?# .*/g, '...');
    // Trim leading whitespace from scenario outlines:
    message = message.replace(/^\s*/gm, '');
    // Remove server URL:
    message = message.replace(/ at http.*/g, '.');
    // Really shitty match for some Error messages.
    // I'm not actually sure why these come back on stdout...?

    // If it's not something we care about, ignore it:
    if (!message.match(/^(Feature|Scenario|Given|Then|When)/)) {
        return null;
    }

    return {
        message: message,
        type: 'info'
    };
}

function sendErrorToClient () {
    this.emit('protractor-err', {
        message: 'Something went really wrong - check the console for details.',
        type: 'error'
    });
}
