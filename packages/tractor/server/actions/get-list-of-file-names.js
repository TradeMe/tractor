'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));

module.exports = createHandlerForDirectoryAndExtension;

function createHandlerForDirectoryAndExtension (directory, extension) {
    var directoryPath = path.join(config.testDirectory, directory);
    return getListOfFileNames.bind(null, directoryPath, extension);
}

function getListOfFileNames (directoryPath, extension, request, response) {
    var extensionRegex = new RegExp(extension.replace('.', '\\.') + '$');
    return fs.readdirAsync(directoryPath)
    .then(function (fileNames) {
        response.send(JSON.stringify(filterFileNamesByExtension(fileNames, extensionRegex)));
    })
    .catch(function (error) {
        var message = 'Reading list of "' + extension + '" files failed.';
        errorHandler(response, error, message);
    });
}

function filterFileNamesByExtension (fileNames, extensionRegex) {
    return fileNames
    .filter(function (fileName) {
        return extensionRegex.test(fileName);
    })
    .map(function (fileName) {
        return fileName.replace(extensionRegex, '');
    });
}
