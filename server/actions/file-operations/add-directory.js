'use strict';

// Dependenices:
var fileStructure = require('./file-structure');

// Constants:
var NEW_DIRECTORY = 'New Directory';
var ERROR_MESSAGE = 'Adding new directory failed.';

module.exports = fileStructure.createModifier(addDirectory, ERROR_MESSAGE);

function addDirectory (directories, request) {
    var directory = fileStructure.findDirectory(directories, request.body.path);
    var newDirectoryName = getNewDirectoryName(directory);
    directory[newDirectoryName] = {
        '-type': 'd'
    };
    return directories;
}

function getNewDirectoryName (directory) {
    var n = 0;
    var newDirectoryName;
    do {
        newDirectoryName = createNewDirectoryName(n);
        n += 1;
    } while (newDirectoryNameExists(directory, newDirectoryName));
    return newDirectoryName;
}

function createNewDirectoryName (n) {
    return NEW_DIRECTORY + (n !== 0 ? ' (' + n + ')' : '');
}

function newDirectoryNameExists (directory, newFolderName) {
    return !!directory[newFolderName];
}
