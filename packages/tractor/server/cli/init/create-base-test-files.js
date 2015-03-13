'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

// Errors:
var BaseTestFileAlreadyExistsError = require('../../errors/BaseTestFileAlreadyExistsError');

module.exports = {
    run: createBaseTestFiles
};

function createBaseTestFiles (testDirectoryPath) {
    return createWorldFile(path.join(testDirectoryPath, constants.SUPPORT_DIR))
    .catch(BaseTestFileAlreadyExistsError, function (e) {
        log.warn(e.message + ' Not copying...');
    })
    .then(function () {
        return createProtractorConf(testDirectoryPath);
    })
    .catch(BaseTestFileAlreadyExistsError, function (e) {
        log.warn(e.message + ' Not copying...');
    });
}

function createWorldFile (supportDirPath) {
    var fileName = constants.WORLD_FILE_NAME;
    var readPath = path.join(__dirname, constants.WORLD_SOURCE_FILE_PATH);
    var writePath = path.join(process.cwd(), supportDirPath, constants.WORLD_FILE_NAME);
    return createFile(fileName, readPath, writePath);
}

function createProtractorConf (testDirectoryPath) {
    var fileName = constants.PROTRACTOR_CONF_FILE_NAME;
    var readPath = path.join(__dirname, constants.PROTRACTOR_CONF_SOURCE_FILE_PATH);
    var writePath = path.join(process.cwd(), testDirectoryPath, constants.PROTRACTOR_CONF_FILE_NAME);
    return createFile(fileName, readPath, writePath);
}

function createFile (fileName, readPath, writePath) {
    return fs.openAsync(writePath, 'r')
    .then(function () {
        throw new BaseTestFileAlreadyExistsError('"' + fileName + '" already exists.');
    })
    .catch(Promise.OperationalError, function () {
        logCreating(fileName);
    })
    .then(function () {
        return fs.readFileAsync(readPath);
    })
    .then(function (contents) {
        return fs.writeFileAsync(writePath, contents);
    })
    .then(function () {
        logCreated(fileName);
    });
}

function logCreating (file) {
    log.info('Creating "' + file + '"...');
}

function logCreated (file) {
    log.success('"' + file + '" created.');
}
