'use strict';

// Config:
var config = require('../../utils/get-config')();

// Utilities:
var _ = require('lodash');
var constants = require('../../constants');
var path = require('path');

// Dependencies:
var esprima = require('esprima');
var fileStructureUtils = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Reading file structure failed.';
var STARTS_WITH_DOT = /^\./;

// Errors:
var ParseJavaScriptError = require('../../errors/ParseJavaScriptError');

module.exports = createFileStructureHandler();

function createFileStructureHandler () {
    var handler = fileStructureUtils.createModifier(fileStructureUtils.noop, parse, ERROR_MESSAGE);
    return function (request, response) {
        var directoryKey = request.query.directory.toUpperCase() + '_DIR';
        request.body.root = path.join(config.testDirectory, constants[directoryKey]);
        handler(request, response);
    };
}

function parse (fileStructure, request, response) {
    if (request.query.parse) {
        fileStructure.allFiles.forEach(function (file) {
            try {
                file.ast = esprima.parse(file.content, {
                    comment: true
                });
            } catch (e) {
                throw new ParseJavaScriptError('Parsing "' + file.name + '" failed.');
            }
        });
    }
    return fileStructure;
}
