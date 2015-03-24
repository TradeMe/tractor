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
var fileStructureUtils = require('./file-actions/file-structure');
var stripcolorcodes = require('stripcolorcodes');

var GIVEN_WHEN_THEN_REGEX = /^(Given|When|Then)/;
var AND_BUT_REGEX = /^(And|But)/;

module.exports = saveFeatureFile;

function saveFeatureFile (request, response) {
    var name = request.body.name + constants.FEATURES_EXTENSION;
    var feature = request.body.feature.replace(new RegExp(constants.FEATURE_NEWLINE, 'g'), os.EOL);

    var featurePath = path.join(config.testDirectory, constants.FEATURES_DIR, name);

    var fileNames = generateFileNames(feature);

    return fs.writeFileAsync(featurePath, feature)
    .then(function () {
        return childProcess.execAsync(constants.CUCUMBER_COMMAND + '"' + featurePath + '"');
    })
    .spread(generateStepDefinitions.bind(null, fileNames))
    .then(function () {
        response.send(JSON.stringify({
            message: 'Cucumber stubs generated.'
        }));
    })
    .catch(function (error) {
        console.log(error);
        errorHandler(response, error, 'Generating Cucumber stubs failed.');
    });
}


function generateFileNames (feature) {
    return stripcolorcodes(feature)
    // Split on new-lines:
    .split(/\r\n|\n/)
    // Remove whitespace:
    .map(function (line) {
        return line.trim();
    })
    // Get out each step name:
    .filter(function (line) {
        return GIVEN_WHEN_THEN_REGEX.test(line) || AND_BUT_REGEX.test(line);
    })
    .map(function (fileName, index, fileNames) {
        if (AND_BUT_REGEX.test(fileName)) {
            var previousType = _.last(fileNames[index - 1].match(GIVEN_WHEN_THEN_REGEX));
            return fileName.replace(AND_BUT_REGEX, previousType);
        } else {
            return fileName;
        }
    })
    // Replace <s and >s
    .map(function (fileName) {
        return fileName.replace(/</g, '_').replace(/>/g, '_');
    })
    // Replace money:
    .map(function (fileName) {
        return fileName.replace(/\$\d+/g, '\$amount');
    })
    // Replace numbers:
    .map(function (fileName) {
        return fileName.replace(/\d+/g, '\$number');
    });
}

function generateStepDefinitions (fileNames, result) {
    return fileStructureUtils.getFileNames(path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR))
    .then(function (stepDefinitionFileNames) {
        return Promise.all(splitResultToStubs(result).map(function (stub, index) {
            return generateStepDefinitionFile(stepDefinitionFileNames, stub, fileNames[index]);
        }));
    });
}

function splitResultToStubs (result) {
    var pieces = stripcolorcodes(result)
    // Split on new-lines:
    .split(/(\r\n|\n){2}/);
    // Filter out everything that isn't a step definition:
    return pieces.filter(function (piece) {
        return !!/^this\.(Given|Then|When)[\s\S]*\}\);$/m.exec(piece);
    });
}

function generateStepDefinitionFile (stepDefinitionFileNames, stub, fileName) {
    fileName = fileName + constants.STEP_DEFINITIONS_EXTENSION;
    var stepPath = path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR, fileName);
    if (!_.contains(stepDefinitionFileNames, fileName)) {
        return fs.writeFileAsync(stepPath, formatStubCode(stub));
    } else {
        return false;
    }
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
