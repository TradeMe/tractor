'use strict';

// Utilities:
var _ = require('lodash');
var errorHandler = require('../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();
var constants = require('../constants');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var escodegen = require('escodegen');

// Errors:
var GenerateJavaScriptError = require('../Errors/GenerateJavaScriptError');

module.exports = saveStepDefinitionFile;

function saveStepDefinitionFile (request, response) {
    var name = request.body.name + constants.STEP_DEFINITIONS_EXTENSION;

    var javascript = null;
    try {
        generateJavaScript(request);
    } catch (e) {
        errorHandler(response, new GenerateJavaScriptError('Invalid step definition.'));
        return Promise.resolve();
    }

    return saveJavaScriptFile(name, javascript, response);
}

function generateJavaScript (request) {
    var program = rebuildRegExps(request.body.program);
    return escodegen.generate(program);
}

function rebuildRegExps (object) {
    _.each(object, function (value) {
        if (value && value.type === 'Literal' && value.raw && value.value) {
            value.value = new RegExp(value.raw.replace(/^\//, '').replace(/\/$/, ''));
        } else if (_.isArray(value) || _.isObject(value)) {
            rebuildRegExps(value);
        }
    });
    return object;
}

function saveJavaScriptFile (name, javascript, response) {
    var stepPath = path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR, name);
    return fs.writeFileAsync(stepPath, javascript)
    .then(function () {
        response.send(JSON.stringify({
            message: '"' + name + '" saved successfully.'
        }));
    })
    .catch(function (error) {
        errorHandler(response, error, 'Saving "' + name + '" failed.');
    });
}
