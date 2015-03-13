'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var childProcess = Promise.promisifyAll(require('child_process'));

module.exports = {
    run: setUpSelenium
};

function setUpSelenium () {
    log.info('Setting up Selenium...');
    return childProcess.execAsync(constants.SELENIUM_UPDATE_COMMAND)
    .then(function () {
        log.success('Selenium setup complete.');
    });
}
