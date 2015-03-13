'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();
var constants = require('../constants');

// Dependencies:
var escodegen = require('escodegen');
var fs = Promise.promisifyAll(require('fs'));

// Errors:
var GenerateJavaScriptError = require('../Errors/GenerateJavaScriptError');

module.exports = saveComponentFile;

function saveComponentFile (request, response) {
    var name = request.body.name + constants.COMPONENTS_EXTENSION;

    var javascript = null;
    try {
        javascript = escodegen.generate(request.body.program);
    } catch (e) {
        errorHandler(response, new GenerateJavaScriptError('Invalid component.'));
        return Promise.resolve();
    }

    return saveJavaScriptFile(name, javascript, response);
}

function saveJavaScriptFile (name, javascript, response) {
    var componentPath = path.join(config.testDirectory, constants.COMPONENTS_DIR, name);
    return fs.writeFileAsync(componentPath, javascript)
    .then(function () {
        response.send(JSON.stringify({
            message: '"' + name + '" saved successfully.'
        }));
    })
    .catch(function (error) {
        errorHandler(response, error, 'Saving "' + name + '" failed.');
    });
}
