'use strict';

// Config:
var config = require('../../utils/get-config.js')();

// Utilities:
var log = require('../../utils/logging');

// Dependencies:
var createTestDirectoryStructure = require('./create-test-directory-structure');
var createBaseTestFiles = require('./create-base-test-files');
var installTractorDependenciesLocally = require('./install-tractor-dependencies-locally');
var setUpSelenium = require('./set-up-selenium');

module.exports = function () {
    log.important('Setting up tractor...');

    return createTestDirectoryStructure.run(config.testDirectory)
    .then(function () {
        return createBaseTestFiles.run(config.testDirectory);
    })
    .then(function () {
        return installTractorDependenciesLocally.run();
    })
    .then(function () {
        return setUpSelenium.run();
    })
    .then(function () {
        log.important('Set up complete!');
    })
    .catch(function (e) {
        log.error('Something broke, sorry :(');
        log.error(e.message);
        throw e
    });
};
