'use strict';

// Utilities:
var _ = require('lodash');
var errorHandler = require('../../utils/error-handler');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var escodegen = require('escodegen');

// Errors:
var GenerateJavaScriptError = require('../../Errors/GenerateJavaScriptError');

module.exports = saveStepDefinitionFile;

function saveStepDefinitionFile (request, response) {
    var javascript = null;
    try {
        javascript = generateJavaScript(request.body.ast);
    } catch (e) {
        errorHandler(response, new GenerateJavaScriptError('Invalid step definition.'));
        return Promise.resolve();
    }

    return saveJavaScriptFile(request.body.path, request.body.name, javascript, response);
}

function generateJavaScript (ast) {
    return escodegen.generate(rebuildRegExps(ast), {
        comment: true
    });
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

function saveJavaScriptFile (path, name, javascript, response) {
    return fs.writeFileAsync(path, javascript)
    .then(function () {
        response.send(JSON.stringify({
            message: '"' + name + '" saved successfully.'
        }));
    })
    .catch(function (error) {
        errorHandler(response, error, 'Saving "' + name + '" failed.');
    });
}
