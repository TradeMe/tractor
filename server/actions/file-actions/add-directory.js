'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var fileStructureUtils = require('../../utils/file-structure');

// Constants:
var NEW_DIRECTORY = 'New Directory';

module.exports = fileStructureUtils.createModifier({
    pre: addDirectory
});

function addDirectory (fileStructure, request) {
    var directory = fileStructureUtils.findDirectory(fileStructure, request.body.path);
    var newDirectoryName = getNewDirectoryName(directory);
    directory.directories = directory.directories || [];
        directory.directories.push({
        name: newDirectoryName
    });
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
    return !!_.find(directory.directories, function (directory) {
        return directory.name === newDirectoryName;
    });
}
