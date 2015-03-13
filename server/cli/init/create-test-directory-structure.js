'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

// Errors:
var TestDirectoryAlreadyExistsError = require('../../Errors/TestDirectoryAlreadyExistsError');

module.exports = {
    run: createTestDirectoryStructure
};

function createTestDirectoryStructure (testDirectory) {
    return createRootDirectory(testDirectory)
    .then(function () {
        return createSubDirectories(testDirectory);
    })
    .catch(TestDirectoryAlreadyExistsError, function (e) {
        log.warn(e.message + ' Not creating folder structure...');
    });
}

function createRootDirectory (testDirectory) {
    log.info('Creating directory structure...');
    return fs.mkdirAsync(testDirectory)
    .catch(Promise.OperationalError, function (error) {
        if (error && error.cause && error.cause.code === 'EEXIST') {
            throw new TestDirectoryAlreadyExistsError('"' + testDirectory + '" directory already exists.');
        } else {
            throw error;
        }
    });
}

function createSubDirectories (testDirectory) {
    var createDirectories = [
        constants.COMPONENTS_DIR,
        constants.FEATURES_DIR,
        constants.STEP_DEFINITIONS_DIR,
        constants.MOCK_DATA_DIR,
        constants.SUPPORT_DIR
    ].map(function (directory) {
        return fs.mkdirAsync(path.join(testDirectory, directory));
    });

    return Promise.all(createDirectories)
    .then(function () {
        log.success('Directory structure created.');
    });
}
