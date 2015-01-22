'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

module.exports = (function () {
    return function (testDirectory) {
        return Promise.all([
            createWorldFile(path.join(testDirectory, constants.SUPPORT_DIR)),
            createProtractorConf(testDirectory)
        ]);
    };

    function createWorldFile (supportDirPath) {
        log.info('Creating "' + constants.WORLD_FILE_NAME + '"...');
        return fs.readFileAsync(path.join(__dirname, constants.WORLD_SOURCE_FILE_PATH))
        .then(function (worldSource) {
            return fs.writeFileAsync(path.join(supportDirPath, constants.WORLD_FILE_NAME), worldSource);
        })
        .then(function () {
            log.success('"' + constants.WORLD_FILE_NAME + '" created.');
        });
    }

    function createProtractorConf (testDirectory) {
        log.info('Creating "' + constants.PROTRACTOR_CONF_FILE_NAME + '"...');
        return fs.readFileAsync(path.join(__dirname, constants.PROTRACTOR_CONF_SOURCE_FILE_PATH))
        .then(function (protractorConfSource) {
            protractorConfSource = protractorConfSource.toString();
            protractorConfSource = protractorConfSource.replace(/%%SUPPORT%%/, constants.SUPPORT_DIR);
            protractorConfSource = protractorConfSource.replace(/%%STEP_DEFINITIONS%%/, constants.STEP_DEFINITIONS_DIR);
            return fs.writeFileAsync(path.join(testDirectory, constants.PROTRACTOR_CONF_FILE_NAME), protractorConfSource);
        })
        .then(function () {
            log.success('"' + constants.PROTRACTOR_CONF_FILE_NAME + '" created.');
        });
    }
})();
