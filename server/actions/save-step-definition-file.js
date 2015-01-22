'use strict';

// Config:
var config = require('../utils/get-config');

// Utilities:
var _ = require('lodash');
var constants = require('../constants');
var log = require('../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var escodegen = require('escodegen');

// Errors:
var GenerateJavaScriptError = require('../Errors/GenerateJavaScriptError');

module.exports = (function () {
    return function (req, res) {
        var name = req.body.name + constants.STEP_DEFINITIONS_EXTENSION;

        generateJavaScript(req)
        .then(function (javascript) {
            var stepPath = path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR, name);
            return fs.writeFileAsync(stepPath, javascript);
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
        .catch(function (error) {
            log.error(error);
            res.status(500);
            res.send(JSON.stringify({
                error: 'Saving ' + name + ' failed.'
            }));
        });
    };

    function generateJavaScript (req) {
        return new Promise(function (resolve, reject) {
            try {
                var program = rebuildRegExps(req.body.program);
                resolve(escodegen.generate(program));
            } catch (error) {
                reject(new GenerateJavaScriptError('That is not a valid JavaScript AST.'));
            }
        });
    }

    function rebuildRegExps (object) {
        _.each(object, function (value) {
            if (value && value.type && value.type === 'Literal' && value.raw && value.value) {
                value.value = new RegExp(value.raw.replace(/^\//, '').replace(/\/$/, ''));
            } else if (_.isObject(value) || _.isArray(value)) {
                rebuildRegExps(value);
            }
        });
        return object;
    }
})();
