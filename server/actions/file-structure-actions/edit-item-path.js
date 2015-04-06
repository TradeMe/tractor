'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Dependencies:
var changecase = require('change-case');
var camel = changecase.camel;
var esquery = require('esquery');
var fileStructureModifier = require('./file-structure-utils/file-structure-modifier');
var fileStructureUtils = require('../../utils/file-structure');
var pascal = changecase.pascal;

module.exports = fileStructureModifier.create({
    pre: editItemPath
});

var transforms = {
    '.component.js': componentTransform,
    '.feature': featureTransform,
    '.mock.json': mockDataTransform
};

function editItemPath (fileStructure, request) {
    var body = request.body;
    var isDirectory = body.isDirectory;
    if (isDirectory && body.oldName && body.newName) {
        renameDirectory(fileStructure, request);
    // } else if (isDirectory && body.oldDirectoryPath && body.newDirectoryPath) {
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

    var oldDirectoryPath = body.directoryPath;
    var newDirectoryPath = body.directoryPath;
    var extension = fileStructureUtils.getExtension(oldDirectoryPath);

    var oldPath = path.join(oldDirectoryPath, oldName);
    var newPath = path.join(newDirectoryPath, newName);

    var directory = fileStructureUtils.findDirectory(fileStructure, oldPath);
    deletePaths(directory);
    directory.name = newName;
    directory.path = newPath;

    _.each(directory.allFiles, function (file) {
        transforms[extension](fileStructure, file, {
            oldName: oldName,
            newName: newName,
            oldFilePath: path.join(oldPath, file.name + extension),
            newFilePath: path.join(newPath, file.name + extension)
        });
    });
}

function renameFile (fileStructure, request) {
    var body = request.body;
    var oldName = body.oldName;
    var newName = body.newName;

    var oldDirectoryPath = body.directoryPath;
    var newDirectoryPath = body.directoryPath;
    var extension = fileStructureUtils.getExtension(oldDirectoryPath);

    var oldFilePath = path.join(oldDirectoryPath, oldName + extension);
    var newFilePath = path.join(newDirectoryPath, newName + extension);

    var directory = fileStructureUtils.findDirectory(fileStructure, oldDirectoryPath);
    var file = fileStructureUtils.findFile(directory, oldFilePath);
    deletePaths(file);
    file.name = newName;

    transforms[extension](fileStructure, file, {
        oldName: oldName,
        newName: newName,
        oldFilePath: oldFilePath,
        newFilePath: newFilePath
    });
}

function moveFile (fileStructure, request) {
    var body = request.body;
    var oldName = body.name;
    var newName = body.name;

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

    transforms[extension](fileStructure, file, {
        oldName: oldName,
        newName: newName,
        oldFilePath: oldFilePath,
        newFilePath: newFilePath
    });
}

function deletePaths (item) {
    _.each(item.directories, deletePaths);
    _.each(item.files, function (file) {
        delete file.path;
    });
    delete item.path;
}

function componentTransform (fileStructure, file, options) {
    var oldName = options.oldName;
    var newName = options.newName;
    var oldFilePath = options.oldFilePath;
    var newFilePath = options.newFilePath;

    updateFileReferences(fileStructure, oldFilePath, newFilePath);
    updateIdentifiers(fileStructure, oldFilePath, pascal(oldName), pascal(newName));
    updateIdentifiers(fileStructure, oldFilePath, camel(oldName), camel(newName));
    updateIdentifiersInFile(file, pascal(oldName), pascal(newName));
    updateIdentifiersInFile(file, camel(oldName), camel(newName));
    updateNameInComment(file, newName);
}

function updateFileReferences (fileStructure, oldFilePath, newFilePath) {
    var usagePaths = fileStructure.usages[oldFilePath];
    _.each(usagePaths, function (usagePath) {
        var file = fileStructureUtils.findFile(fileStructure, usagePath);
        var oldRequirePath = getRelativeRequirePath(path.dirname(usagePath), oldFilePath);
        var newRequirePath = getRelativeRequirePath(path.dirname(usagePath), newFilePath);
        _.each(esquery(file.ast, 'CallExpression[callee.name="require"] Literal[value="' + oldRequirePath + '"]'), function (requirePathLiteral) {
            requirePathLiteral.value = newRequirePath;
            requirePathLiteral.raw = '\'' + newRequirePath + '\'';
        });
    });
}

function getRelativeRequirePath (from, to) {
    return path.relative(from, to).replace(/\\/g, '/');
}

function updateIdentifiers (fileStructure, oldFilePath, oldName, newName) {
    var usagePaths = fileStructure.usages[oldFilePath];
    _.each(usagePaths, function (usagePath) {
        var file = fileStructureUtils.findFile(fileStructure, usagePath);
        updateIdentifiersInFile(file, oldName, newName);
    });
}

function updateIdentifiersInFile (file, oldName, newName) {
    _.each(esquery(file.ast, 'Identifier[name="' + oldName + '"]'), function (constructorIdentifier) {
        constructorIdentifier.name = newName;
    });
}

function updateNameInComment (file, newName) {
    var comment = _.first(file.ast.comments);
    var componentMetaData = JSON.parse(comment.value);
    componentMetaData.name = newName;
    comment.value = JSON.stringify(componentMetaData, null, '    ');
}

function featureTransform (fileStructure, file, options) {
    var oldName = options.oldName;
    var newName = options.newName;

    var oldNameRegExp = new RegExp('(Feature:\\s)' + oldName + '(\\r\\n|\\n)');
    file.content = file.content.replace(oldNameRegExp, '$1' + newName + '$2');
}

function mockDataTransform (fileStructure, file, options) {
    var oldName = options.oldName;
    var newName = options.newName;
    var oldFilePath = options.oldFilePath;
    var newFilePath = options.newFilePath;

    updateFileReferences(fileStructure, oldFilePath, newFilePath);
    updateIdentifiers(fileStructure, oldFilePath, camel(oldName), camel(newName));
}
