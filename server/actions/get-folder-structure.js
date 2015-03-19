'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();

// Dependencies:
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = createHandlerForDirectory;

function createHandlerForDirectory (directory) {
    var directoryPath = path.join(config.testDirectory, directory);
    return getFolderStructure.bind(null, directoryPath);
}

function getFolderStructure (directoryPath, request, response) {
    return jsondir.dir2jsonAsync(directoryPath)
    .then(function (fileStructure) {
        response.send(JSON.stringify(fileStructure));
    })
    .catch(function (error) {
        var message = 'Reading "' + directoryPath + '" file structure failed.';
        errorHandler(response, error, message);
    });
}