'use strict';

// Config:
var config = require('./create-config')();
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var os = require('os');
var path = require('path');
var Promise = require('bluebird');

// Dependencies:
var childProcess = Promise.promisifyAll(require('child_process'));
var esprima = require('esprima');
var estemplate = require('estemplate');
var fileStructureUtils = require('./file-structure-utils/file-structure-utils');
var stripcolorcodes = require('stripcolorcodes');

module.exports = {
    generateStepDefinitions: generateStepDefinitions
};

var GIVEN_WHEN_THEN_REGEX = /^(Given|When|Then)/;
var AND_BUT_REGEX = /^(And|But)/;
var STUB_REGEX_REGEX = /this\.[Given|When|Then]*\(\/\^(.*?)\$\//;

function generateStepDefinitions (fileStructure, request) {
    var body = request.body;

    var feature = body.data.replace(constants.FEATURE_NEWLINE, os.EOL);
    var featurePath = body.path;

    var stepNames = extractStepNames(feature);

    return childProcess.execAsync(constants.CUCUMBER_COMMAND + '"' + featurePath + '"')
    .spread(function (result) {
        console.log(result);
        return generateStepDefinitionFiles(fileStructure, stepNames, result);
    });
}

function extractStepNames (feature) {
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
    .map(function (stepName, index, stepNames) {
        if (AND_BUT_REGEX.test(stepName)) {
            var previousType = _(stepNames)
            .take(index + 1)
            .reduceRight(function (p, n) {
                var type = n.match(GIVEN_WHEN_THEN_REGEX);
                return p || _.last(type);
            }, null);

            return stepName.replace(AND_BUT_REGEX, previousType);
        } else {
            return stepName;
        }
    });
}

function generateStepDefinitionFiles (fileStructure, stepNames, result) {
    var existingFileNames = _(fileStructure.allFiles)
    .filter(function (file) {
        return file.path.match(new RegExp(constants.STEP_DEFINITIONS_EXTENSION + '$'));
    })
    .map(function (file) {
        return file.name;
    })
    .value();

    var directoryPath = path.join(process.cwd(), config.testDirectory, constants.STEP_DEFINITIONS_DIR);
    var directory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    var files = _(splitResultToStubs(result))
    .map(function (stub) {
        var stubRegex = new RegExp(_.last(stub.match(STUB_REGEX_REGEX)));
        return generateStepDefinitionFile(existingFileNames, stub, _.find(stepNames, function (stepName) {
            return stubRegex.test(stepName);
        }));
    })
    .compact()
    .value();

    directory.files = directory.files.concat(files);
    fileStructure.allFiles = fileStructure.allFiles.concat(files);
    return fileStructure;
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

function generateStepDefinitionFile (existingFileNames, stub, stepName) {
    var fileName = stepName
    // Escape existing _s:
    .replace(/_/g, '__')
    // Replace / and \:
    .replace(/[\/\\]/g, '_')
    // Replace <s and >s:
    .replace(/</g, '_')
    .replace(/>/g, '_')
    // Replace money:
    .replace(/\$\d+/g, '\$amount')
    // Replace numbers:
    .replace(/\d+/g, '\$number');

    if (!_.contains(existingFileNames, fileName)) {
        var template = 'module.exports = function () {%= body %};';
        var body = esprima.parse(stub);
        var ast = estemplate(template, {
            body: body.body
        });
        var meta = {
            name: stepName
        };
        ast.comments = [{
            type: 'Block',
            value: JSON.stringify(meta, null, '    ')
        }];
        return {
            name: fileName,
            ast: ast
        };
    } else {
        return null;
    }
}
