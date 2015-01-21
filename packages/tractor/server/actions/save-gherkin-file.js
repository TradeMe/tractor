'use strict';

// Config:
var config = require('../utils/get-config');

// Utilities:
var _ = require('lodash');
var constants = require('../constants');
var log = require('../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var cucumber = require('cucumber');
var exec = Promise.promisify(require('child_process').exec);
var fs = Promise.promisifyAll(require('fs'));
var os = require('os');
var path = require('path');

module.exports = (function () {
    return function (req, res) {
        var name = req.body.name + constants.FEATURES_EXTENSION;
        var gherkin = req.body.gherkin.replace(new RegExp(constants.GHERKIN_NEWLINE, 'g'), os.EOL);

        var featurePath = path.join(config.testDirectory, constants.FEATURES_DIR, name);
        fs.writeFileAsync(featurePath, gherkin)
        .then(function () {
            return exec(constants.CUCUMBER_COMMAND + featurePath);
        })
        .spread(function (result) {
            return fs.readdirAsync(path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR))
            .then(function (stepDefinitionFiles) {
                return Promise.all(splitResultToStepDefinitions(result)
                .map(function (stub) {
                    var name = createStepDefinitionName(stub) + constants.STEP_DEFINITIONS_EXTENSION;
                    var stepPath = path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR, name);
                    if (!_.contains(stepDefinitionFiles, name)) {
                        return fs.writeFileAsync(stepPath, formatStepDefinitionCode(stub));
                    } else {
                        return false;
                    }
                }));
            });
        })
        .then(function () {
            res.send(JSON.stringify({
                message: 'Cucumber stubs generated.'
            }));
        })
        .catch(function (error) {
            log.error(error);
            res.status(500);
            res.send(JSON.stringify({
                error: 'Generating Cucumber stubs failed.'
            }));
        });
    };


    function splitResultToStepDefinitions (result) {
        var pieces = result
        .replace(/\u001b\[.*?m/g, '')                              // Replace color characters
        .split(new RegExp(os.EOL + '{2}'));                        // Split on new-lines

        return _.filter(pieces, function (piece) {                 // Filter out everything that isn't a step definition
            return !!(/^this\.(Given|Then|When)[\s\S]*\}\);$/m.exec(piece));
        });
    }

    function createCapitalCaseName (string) {
        return string.split(' ')                                 // Split on the spaces
        .map(function (part) {
            return part.charAt(0).toUpperCase() + part.slice(1); // Uppercase each word
        })
        .join('');                                               // Rejoin
    }

    function createStepDefinitionName (stepDefinition) {
        var type = /^this\.(Given|Then|When)/.exec(stepDefinition) // Find the type of the step definition
        var match = /\^(.*)\$/.exec(stepDefinition);               // Pull out the regex from the step definition
        return type[1] + createCapitalCaseName(match[1]);
    }

    function formatStepDefinitionCode (stepDefinition) {
        var code = stepDefinition.split(os.EOL)                    // Split on new lines
        .map(function (line) {
            return '    ' + line;                                  // Add some indentation
        })
        .join(os.EOL);                                             // Rejoin with new lines

        return 'module.exports = function () {' + os.EOL + code + os.EOL + '};' // Wrap in a `module.exports`
    }
})();
