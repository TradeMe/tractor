'use strict';

// Utilities:
var _ = require('lodash');
var constants = require('../constants');
var errorHandler = require('../utils/error-handler');
var os = require('os');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();

// Dependencies:
var childProcess = Promise.promisifyAll(require('child_process'));
var fs = Promise.promisifyAll(require('fs'));
var pascal = require('change-case').pascal;
var stripcolorcodes = require('stripcolorcodes');

module.exports = saveGherkinFile;

function saveGherkinFile (request, response) {
    var name = request.body.name + constants.FEATURES_EXTENSION;
    var gherkin = request.body.gherkin.replace(new RegExp(constants.GHERKIN_NEWLINE, 'g'), os.EOL);

    var featurePath = path.join(config.testDirectory, constants.FEATURES_DIR, name);
    return fs.writeFileAsync(featurePath, gherkin)
    .then(function () {
        return childProcess.execAsync(constants.CUCUMBER_COMMAND + featurePath);
    })
    .spread(generateStepDefinitions)
    .then(function () {
        response.send(JSON.stringify({
            message: 'Cucumber stubs generated.'
        }));
    })
    .catch(function (error) {
        errorHandler(response, error, 'Generating Cucumber stubs failed.');
    });
}

function generateStepDefinitions (result) {
    return fs.readdirAsync(path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR))
    .then(function (stepDefinitionFiles) {
        return Promise.all(splitResultToStubs(result).map(function (stub) {
            return generateStepDefinitionFile(stepDefinitionFiles, stub);
        }));
    });
}

function splitResultToStubs (result) {
    var pieces = stripcolorcodes(result)
    // Split on new-lines:
    .split(/\r\n?|\n{2}/);
    // Filter out everything that isn't a step definition:
    return pieces.filter(function (piece) {
        return !!/^this\.(Given|Then|When)[\s\S]*\}\);$/m.exec(piece);
    });
}

function generateStepDefinitionFile (stepDefinitionFiles, stub) {
    var name = createStepDefinitionFileName(stub) + constants.STEP_DEFINITIONS_EXTENSION;
    var stepPath = path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR, name);
    if (!_.contains(stepDefinitionFiles, name)) {
        return fs.writeFileAsync(stepPath, formatStubCode(stub));
    } else {
        return false;
    }
}

function createStepDefinitionFileName (stub) {
    // Find the type of the step stub:
    var type = /^this\.(Given|Then|When)/.exec(stub);
    // Pull out the regex from the stub:
    var match = /\^(.*)\$/.exec(stub);
    return type[1] + pascal(match[1]);
}

function formatStubCode (stub) {
    var code = stub
    // Replace generated two space indent with four:
    .replace(/^{\s}2/, '    ')
    // Split on new lines:
    .split(os.EOL)
    .map(function (line) {
        // Add some indentation:
        return '    ' + line;
    })
    // Rejoin with new lines:
    .join(os.EOL);

    // Wrap in a `module.exports`:
    return 'module.exports = function () {' + os.EOL + code + os.EOL + '};';
}
