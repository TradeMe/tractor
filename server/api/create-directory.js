'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var fileStructureModifier = require('../utils/file-structure-modifier');
var fileStructureUtils = require('../utils/file-structure-utils/file-structure-utils');

// Constants:
var NEW_DIRECTORY = 'New Directory';

module.exports = init;

function init () {
    return fileStructureModifier.create({
        preSave: createDirectory
    });
}

function createDirectory (fileStructure, request) {
    var body = request.body;
    var directory = fileStructureUtils.findDirectory(fileStructure, body.path);
    var newDirectoryName = getNewDirectoryName(directory);
    directory.directories.push({
        name: newDirectoryName
    });
    return fileStructure;
}

function getNewDirectoryName (directory) {
    var n = 1;
    var newDirectoryName;
    do {
        newDirectoryName = createNewDirectoryName(n);
        n += 1;
    } while (newDirectoryNameExists(directory, newDirectoryName));
    return newDirectoryName;
}

function createNewDirectoryName (n) {
    return NEW_DIRECTORY + (n !== 1 ? ' (' + n + ')' : '');
}

function newDirectoryNameExists (directory, newDirectoryName) {
    return !!_.find(directory.directories, directoryNameEquals(newDirectoryName));
}

function directoryNameEquals (name) {
    return function (directory) {
        return directory.name === name;
    };
}
