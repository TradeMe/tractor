'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var exec = Promise.promisify(require('child_process').exec);

module.exports = function () {
    log.info('Setting up Selenium...');
    return exec(constants.SELENIUM_UPDATE_COMMAND)
    .then(function () {
        console.log(arguments);
        log.success('Selenium setup complete.');
    });
};
