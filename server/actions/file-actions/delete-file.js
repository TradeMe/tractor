'use strict';

// Utilities:
var _ = require('lodash');
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
    _.remove(isDirectory ? directory.directories : directory.files, nameEquals(name));
    return fileStructure;
}

function nameEquals (name) {
    return function (item) {
        return item.name === name;
    };
}
