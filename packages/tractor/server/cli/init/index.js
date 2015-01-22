'use strict';

// Config:
var config = require('../../utils/get-config.js');

// Utilities:
var log = require('../../utils/logging');

// Dependencies:
var installTractorDependenciesLocally = require('./install-tractor-dependencies-locally');
var createTestDirectoryStructure = require('./create-test-directory-structure');
var createBaseTestFiles = require('./create-base-test-files');
var setUpSelenium = require('./set-up-selenium');

// Errors:
var TestDirectoryAlreadyExistsError = require('../../Errors/TestDirectoryAlreadyExistsError');

module.exports = function () {
    return function () {
        log.important('Setting up tractor...');

        createTestDirectoryStructure(config.testDirectory)
        .then(function () {
            return createBaseTestFiles(config.testDirectory);
        })
        .catch(TestDirectoryAlreadyExistsError, function (e) {
            log.warn(e.message + ' No need to create folder structure or files...');
        })
        .then(function () {
            return installTractorDependenciesLocally();
        })
        .then(function () {
            return setUpSelenium();
        })
        .then(function () {
            log.important('Set up complete!');
        })
        .catch(function (e) {
            log.error('Something broke, sorry :(');
            log.error(e);
            throw e
        });
    };
};
