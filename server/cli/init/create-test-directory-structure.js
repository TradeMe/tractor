'use strict';

// Utilities:
var _ = require('lodash');
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

// Errors:
var TestDirectoryAlreadyExistsError = require('../../Errors/TestDirectoryAlreadyExistsError');

module.exports = (function () {
    return function (testDirectory) {
        return createRootDirectory(testDirectory)
        .then(function () {
            return createSubDirectories(testDirectory);
        });
    };

    function createRootDirectory (testDirectory) {
        log.info('Creating directory structure...');
        return fs.mkdirAsync(testDirectory)
        .catch(Promise.OperationalError, function (e) {
            if (e && e.cause && e.cause.code === 'EEXIST') {
                throw new TestDirectoryAlreadyExistsError('"' + testDirectory + '" directory already exists.');
            }
        });
    }

    function createSubDirectories (testDirectory) {
        var createDirectories = _.map([
            constants.FEATURES_DIR,
            constants.STEP_DEFINITIONS_DIR,
            constants.COMPONENTS_DIR,
            constants.MOCK_DATA_DIR,
            constants.SUPPORT_DIR
        ], function (dir) {
            return fs.mkdirAsync(path.join(testDirectory, dir));
        });

        return Promise.all(createDirectories)
        .then(function () {
            log.success('Directory structure created.');
        });
    }
})();
