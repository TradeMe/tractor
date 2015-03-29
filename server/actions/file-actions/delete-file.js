'use strict';

// Utilities:
var path = require('path');

// Dependencies:
var fileStructureUtils = require('../../utils/file-structure');

module.exports = fileStructureUtils.createModifier({
    pre: deleteFile
});

function deleteFile (fileStructure, request) {
    var name = request.body.name;
    var filePath = request.body.path;
    var isDirectory = request.body.isDirectory;

    var directory = fileStructureUtils.findDirectory(fileStructure, path.dirname(filePath));
    var toDeleteName = isDirectory ? name : name + fileStructureUtils.getExtension(filePath);
    delete directory[toDeleteName];
    return fileStructure;
}
