'use strict';

// Utilities:
var errorHandler = require('../utils/error-handler');
var Promise = require('bluebird');

// Dependenices:
var jsondir = Promise.promisifyAll(require('jsondir'));

// Constants:
var NEW_FOLDER = 'New Folder';

module.exports = editDirectory;

function editDirectory (request, response) {
    var newFolderStructure;

    jsondir.dir2jsonAsync(request.body.path)
    .then(function (folderStructure) {
        if (request.body.oldName) {

        } else {
            folderStructure[getNewFolderName(folderStructure)] = {
                '-type': 'd'
            };
        }
        newFolderStructure = folderStructure;
        return jsondir.json2dirAsync(newFolderStructure);
    })
    .then(function () {
        response.send(JSON.stringify(newFolderStructure));
    })
    .catch(function (error) {
        var message = 'Creating new folder failed.';
        errorHandler(response, error, message);
    });
}

function getNewFolderName (folderStructure) {
    var n = 0;
    var newFolderName;
    do {
        newFolderName = createNewFolderName(n++);
    } while (newFolderNameExists(folderStructure, newFolderName));
    return newFolderName;
}

function createNewFolderName (n) {
    return NEW_FOLDER + (n !== 0 ? ' (' + n + ')' : '');
}

function newFolderNameExists (folderStructure, newFolderName) {
    return !!folderStructure[newFolderName];
}