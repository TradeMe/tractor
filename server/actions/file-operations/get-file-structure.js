'use strict';

// Config:
var config = require('../../utils/get-config')();

// Utilities:
var constants = require('../../constants');
var path = require('path');

// Dependencies:
var fileStructureUtils = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Reading file structure failed.';

module.exports = createFileStructureHandler();

function createFileStructureHandler () {
    var handler = fileStructureUtils.createModifier(noop, ERROR_MESSAGE);
    return function (request, response) {
        var directoryKey = request.query.directory.toUpperCase() + '_DIR';
        request.body.root = path.join(config.testDirectory, constants[directoryKey]);
        handler(request, response);
    };
}

function noop (fileStructure) {
    return fileStructure;
}
