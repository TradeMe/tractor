'use strict';

// Dependenices:
var fileStructureUtils = require('./file-structure');

// Constants:
var NEW_DIRECTORY = 'New Directory';
var ERROR_MESSAGE = 'Adding new directory failed.';

module.exports = fileStructureUtils.createModifier(addDirectory, fileStructureUtils.noop, ERROR_MESSAGE);

function addDirectory (fileStructure, request) {
    var directory = fileStructureUtils.findDirectory(fileStructure, request.body.path);
    var newDirectoryName = getNewDirectoryName(directory);
    directory[newDirectoryName] = {
        '-type': 'd'
    };
    return fileStructure;
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

function newDirectoryNameExists (directory, newDirectoryName) {
    return !!directory[newDirectoryName];
}
