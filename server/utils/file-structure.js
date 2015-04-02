'use strict';

// Config:
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');

// Dependencies:
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = {
    findDirectory: findDirectory,
    findFile: findFile,
    getExtension: getExtension,
    getFileNames: getFileNames
};

function findDirectory (directory, directoryPath) {
    if (directory.path === directoryPath) {
        return directory;
    }
    var dir;
    _.each(directory.directories, function (directory) {
        if (!dir) {
            if (directory.path === directoryPath) {
                dir = directory;
            } else {
                dir = findDirectory(directory, directoryPath);
            }
        }
    });
    return dir;
}

function findFile (directory, filePath) {
    return _.find(directory.allFiles, function (file) {
        return file.path === filePath;
    });
}

function getExtension (directoryPath) {
    return _(directoryPath.split(path.sep))
            .map(function (directoryName) {
                var extensionKey = directoryName.toUpperCase() + '_EXTENSION';
                return constants[extensionKey];
            })
            .compact()
            .first() || '';
}

function getFileNames (directoryPath, extension) {
    return jsondir.dir2jsonAsync(directoryPath)
    .then(function (fileStructure) {
        return _.map(fileStructure.allFiles, function (file) {
            return file.name;
        })
            .filter(function (name) {
                return !extension || name.match(new RegExp(extension + '$'));
            });
    });
}
