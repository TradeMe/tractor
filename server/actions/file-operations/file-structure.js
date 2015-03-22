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
    findDirectory: findDirectory,
    findContainingDirectory: findContainingDirectory
};

function createModifier (modifier, errorMessage) {
    return function (request, response) {
        jsondir.dir2jsonAsync(request.body.root, {
            attributes: ['content']
        })
        .then(function (folderStructure) {
            folderStructure = modifier(folderStructure, request);
            return jsondir.json2dirAsync(folderStructure, {
                nuke: true
            });
        })
        .then(function () {
            return jsondir.dir2jsonAsync(request.body.root);
        })
        .then(function (newFolderStructure) {
            response.send(JSON.stringify(newFolderStructure));
        })
        .catch(function (error) {
            console.log(error);
            errorHandler(response, error, errorMessage);
        });
    };
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
