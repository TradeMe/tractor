'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Dependencies:
var fileStructureModifier = require('./file-structure-utils/file-structure-modifier');
var fileStructureUtils = require('../../utils/file-structure');

module.exports = fileStructureModifier.create({
    pre: copyFile
});

function copyFile (fileStructure, request) {
    var filePath = request.body.path;
    var directoryPath = path.dirname(filePath);
    var directory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    var file = fileStructureUtils.findFile(directory, filePath);

    var copy = {
        name: getFileCopyName(directory, file.name),
    };

    if (file.ast) {
        copy.ast = _.clone(file.ast)
    } else if (file.tokens) {
        copy.tokens = _.clone(file.tokens);
    } else {
        copy.content = file.content;
    }

    directory.files.push(copy);
    fileStructure.allFiles.push(copy);
    return fileStructure;
}

function getFileCopyName (directory, fileName) {
    var n = 1;
    var fileCopyName;
    do {
        fileCopyName = createFileCopyName(fileName, n);
        n += 1;
    } while (fileCopyNameExists(directory, fileCopyName));
    return fileCopyName;
}

function createFileCopyName (fileName, n) {
    return fileName + ' copy' + (n !== 1 ? ' ' + n : '');
}

function fileCopyNameExists (directory, fileCopyName) {
    return !!_.find(directory.files, function (file) {
        return file.name === fileCopyName;
    });
}
