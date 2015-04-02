'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Dependencies:
var changecase = require('change-case');
var camel = changecase.camel;
var esquery = require('esquery');
var pascal = changecase.pascal;
var fileStructureModifier = require('./file-structure-utils/file-structure-modifier');
var fileStructureUtils = require('../../utils/file-structure');

module.exports = fileStructureModifier.create({
    pre: editItemPath
});

function editItemPath (fileStructure, request) {
    var body = request.body;
    var isDirectory = body.isDirectory;
    if (isDirectory && body.oldName && body.newName) {
        renameDirectory(fileStructure, request);
    } else if (isDirectory && body.oldDirectoryPath && body.newDirectoryPath) {
        // Move directory (can't do this yet/ever?)
    } else if (!isDirectory && body.oldName && body.newName) {
        renameFile(fileStructure, request);
    } else if (!isDirectory && body.oldDirectoryPath && body.newDirectoryPath) {
        moveFile(fileStructure, request);
    }
    return fileStructure;
}

function renameDirectory (fileStructure, request) {
    var body = request.body;
    var oldName = body.oldName;
    var newName = body.newName;

    var directoryPath = body.directoryPath;

    var oldPath = path.join(directoryPath, oldName);
    var newPath = path.join(directoryPath, newName);

    var directory = fileStructureUtils.findDirectory(fileStructure, oldPath);
    deletePaths(directory);
    directory.name = newName;
    directory.path = newPath;

    var extension = fileStructureUtils.getExtension(directoryPath);
    _.each(directory.allFiles, function (file) {
        var oldFilePath = path.join(oldPath, file.name + extension)
        var newFilePath = path.join(newPath, file.name + extension);
        updateFileReferences(fileStructure, oldFilePath,newFilePath);
    });
}

function renameFile (fileStructure, request) {
    var body = request.body;
    var oldName = body.oldName;
    var newName = body.newName;

    var directoryPath = body.directoryPath;
    var extension = fileStructureUtils.getExtension(directoryPath);

    var oldFilePath = path.join(directoryPath, oldName + extension);
    var newFilePath = path.join(directoryPath, newName + extension);

    var directory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    var file = fileStructureUtils.findFile(directory, oldFilePath);
    deletePaths(file);
    file.name = newName;

    var extension = fileStructureUtils.getExtension(directoryPath);
    updateFileReferences(fileStructure, oldFilePath,newFilePath);
}

function moveFile (fileStructure, request) {
    var body = request.body;
    var name = body.name;

    var oldDirectoryPath = request.body.oldDirectoryPath;
    var newDirectoryPath = request.body.newDirectoryPath;
    var extension = fileStructureUtils.getExtension(oldDirectoryPath);

    var oldFilePath = path.join(oldDirectoryPath, name + extension);
    var newFilePath = path.join(newDirectoryPath, name + extension);

    var oldDirectory = fileStructureUtils.findDirectory(fileStructure, oldDirectoryPath);
    var newDirectory = fileStructureUtils.findDirectory(fileStructure, newDirectoryPath);

    var file = fileStructureUtils.findFile(oldDirectory, oldFilePath);
    _.remove(oldDirectory.files, file);
    newDirectory.files = newDirectory.files || [];
    deletePaths(file);
    newDirectory.files.push(file);

    var extension = fileStructureUtils.getExtension(oldDirectoryPath);
    updateFileReferences(fileStructure, oldFilePath,newFilePath);
}

function deletePaths (item) {
    _.each(item.directories, deletePaths)
    _.each(item.files, function (file) {
        delete file.path;
    });
    delete item.path;
}

function updateFileReferences (fileStructure, oldFilePath, newFilePath) {
    var usagePaths = fileStructure.usages[oldFilePath];
    _.each(usagePaths, function (usagePath) {
        var file = fileStructureUtils.findFile(fileStructure, usagePath);
        var oldRequirePath = getRelativeNodePath(path.dirname(usagePath), oldFilePath);
        var newRequirePath = getRelativeNodePath(path.dirname(usagePath), newFilePath);
        _.each(esquery(file.ast, 'CallExpression[callee.name="require"] Literal[value="' + oldRequirePathh + '"]'), function (requirePathLiteral) {
            requirePathLiteral.value = newRequirePath;
            requirePathLiteral.raw = '\'' + newRequirePath + '\'';
        });
    });
}

function getRelativeNodePath (from, to) {
    return path.relative(from, to).replace(/\\/g, '/');
}

//function componentTransform (fileStructure, oldName, newName, oldComponentPath, newComponentPath) {
//    var nonalphaquote = '([^a-zA-Z0-9\"])';
//    var componentUsages = fileStructure.usages[oldComponentPath] || [];
//    componentUsages.push(oldComponentPath);
//    return componentUsages.map(function (usagePath) {
//        return {
//            path: usagePath,
//            transforms: [{
//                replace: nonalphaquote + pascal(oldName) + nonalphaquote,
//                with: '$1' + pascal(newName) + '$2'
//            }, {
//                replace: nonalphaquote + camel(oldName) + nonalphaquote,
//                with: '$1' + camel(newName) + '$2'
//            }, {
//                replace: '\"' + oldName + '\"',
//                with: '"' + newName + '"'
//            }, {
//                replace: path.relative(path.dirname(usagePath), oldComponentPath),
//                with: path.relative(path.dirname(usagePath), newComponentPath)
//            }]
//        };
//    });
//}

//function featureTransform (oldName, newName) {
//    return Promise.resolve([{
//        replace: '(\\s)' + oldName + '(\\r\\n|\\n)',
//        with: '$1' + newName + '$2'
//    }]);
//}
//
//function mockDataTransform (oldName, newName) {
//    return fileStructureUtils.getFileUsages(config.testDirectory)
//    .then(function () {
//        return [];
//    });
//}
