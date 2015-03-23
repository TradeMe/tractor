'use strict';

// Dependencies:
var fileStructureUtils = require('./file-structure');

// Constants:
var ERROR_MESSAGE = 'Moving file failed.';

module.exports = fileStructureUtils.createModifier(moveFile, ERROR_MESSAGE);

function moveFile (fileStructure, request) {
    var directoryPath = request.body.directoryPath;
    var fileName = request.body.fileName;
    var filePath = request.body.filePath;
    var originalDirectory = fileStructureUtils.findContainingDirectory(fileStructure, filePath);
    var newDirectory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    if (originalDirectory !== newDirectory) {
        newDirectory[fileName] = fileStructureUtils.deletePaths(originalDirectory[fileName]);
        delete originalDirectory[fileName];
    }
    return fileStructure;
}
