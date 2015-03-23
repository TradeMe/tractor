'use strict';

// Utilities:
var _ = require('lodash');
var errorHandler = require('../../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Dependenices:
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = {
    createModifier: createModifier,
    deletePaths: deletePaths,
    findDirectory: findDirectory,
    findContainingDirectory: findContainingDirectory
};

function createModifier (modifier, errorMessage) {
    return function (request, response) {
        jsondir.dir2jsonAsync(request.body.root, {
            attributes: ['content']
        })
        .then(function (fileStructure) {
            fileStructure = modifier(fileStructure, request);
            return jsondir.json2dirAsync(fileStructure, {
                nuke: true
            });
        })
        .then(function () {
            return jsondir.dir2jsonAsync(request.body.root);
        })
        .then(function (newFileStructure) {
            response.send(JSON.stringify(newFileStructure));
        })
        .catch(function (error) {
            console.log(error);
            errorHandler(response, error, errorMessage);
        });
    };
}

function deletePaths (directory) {
    delete directory['-path'];
    _.each(directory, function (item) {
        delete item['-path'];
        if (item['-type'] === 'd') {
            item = deletePaths(item);
        }
    });
    return directory;
}

function findDirectory (directory, itemPath) {
    var dir;
    if (directory['-path'] === itemPath) {
        return directory;
    }
    _.each(directory, function (item) {
        if (!dir && item['-type'] === 'd') {
            if (item['-path'] === itemPath) {
                dir = item;
            } else {
                dir = findDirectory(item, itemPath);
            }
        }
    });
    return dir;
}

function findContainingDirectory (directory, itemPath) {
    return findDirectory(directory, path.dirname(itemPath));
}
