'use strict';

// Config:
var config = require('../utils/get-config');

// Utilities:
var log = require('../utils/logging');
var constants = require('../constants');
var Promise = require('bluebird');

// Dependencies:
var escodegen = require('escodegen')
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

// Errors:
var GenerateJavaScriptError = require('../Errors/GenerateJavaScriptError');

module.exports = (function () {
    return function (req, res) {
        var name = req.body.name + constants.COMPONENTS_EXTENSION;

        generateJavaScript(req)
        .then(function (javascript) {
            var componentPath = path.join(config.testDirectory, constants.COMPONENTS_DIR, name);
            return fs.writeFileAsync(componentPath, javascript);
        })
        .then(function () {
            res.send(JSON.stringify({
                message: name + ' saved successfully.'
            }));
        })
        .catch(GenerateJavaScriptError, function (error) {
            res.status(400);
            res.send(JSON.stringify({
                error: error.message
            }));
        })
        .catch(function () {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Saving ' + name + ' failed.'
            }));
        });
    };

    function generateJavaScript (req) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(escodegen.generate(req.body.program));
            } catch (error) {
                reject(new GenerateJavaScriptError('That is not a valid JavaScript AST.'));
            }
        });
    }
})();
