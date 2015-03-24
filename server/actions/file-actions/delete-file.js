'use strict';

// Dependencies:
var fileStructureUtils = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Deleting file failed.';

module.exports = fileStructureUtils.createModifier(deleteFile, fileStructureUtils.noop, ERROR_MESSAGE);

function deleteFile (fileStructure, request) {
    var name = request.body.name;
    var path = request.body.path;
    var directory = fileStructureUtils.findContainingDirectory(fileStructure, path);
    delete directory[name];
    return fileStructure;
}
