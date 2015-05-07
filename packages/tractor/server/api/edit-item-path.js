'use strict';

// Utilities:
var _ = require('lodash');
var constants = require('../constants');
var noop = require('node-noop').noop;
var path = require('path');

// Dependencies:
var changecase = require('change-case');
var camel = changecase.camel;
var esquery = require('esquery');
var fileStructureModifier = require('../utils/file-structure-modifier');
var fileStructureUtils = require('../utils/file-structure-utils/file-structure-utils');
var pascal = changecase.pascal;

module.exports = init;

var transforms = {};
transforms[constants.COMPONENTS_EXTENSION] = componentTransform;
transforms[constants.FEATURES_EXTENSION] = featureTransform;
transforms[constants.STEP_DEFINITIONS_EXTENSION] = noop;
transforms[constants.MOCK_DATA_EXTENSION] = mockDataTransform;

function init () {
    return fileStructureModifier.create({
        preSave: editItemPath
    });
}

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
    var existingDirectory = fileStructureUtils.findDirectory(fileStructure, newPath);

    var numberOfDirectoriesWithSameName = 0;
    var originalNewName = newName;
    while (existingDirectory) {
        numberOfDirectoriesWithSameName += 1;
        newName = createUniqueName(originalNewName, numberOfDirectoriesWithSameName + 1);
        newPath = path.join(newDirectoryPath, newName);
        existingDirectory = fileStructureUtils.findDirectory(fileStructure, newPath);
    }

    deletePaths(directory);
    directory.name = newName;
    directory.path = newPath;

    _.each(directory.allFiles, function (file) {
        transforms[extension](fileStructure, file, {
            oldName: file.name,
            newName: file.name,
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
    var existingFile = fileStructureUtils.findFile(directory, newFilePath);

    var numberOfFilesWithSameName = 0;
    var originalNewName = newName;
    while (existingFile) {
        numberOfFilesWithSameName += 1;
        newName = createUniqueName(originalNewName, numberOfFilesWithSameName + 1);
        newFilePath = path.join(newDirectoryPath, newName + extension);
        existingFile = fileStructureUtils.findFile(directory, newFilePath);
    }

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

    var oldDirectoryPath = body.oldDirectoryPath;
    var newDirectoryPath = body.newDirectoryPath;
    var extension = fileStructureUtils.getExtension(oldDirectoryPath);

    var oldFilePath = path.join(oldDirectoryPath, oldName + extension);
    var newFilePath = path.join(newDirectoryPath, newName + extension);

    var oldDirectory = fileStructureUtils.findDirectory(fileStructure, oldDirectoryPath);
    var newDirectory = fileStructureUtils.findDirectory(fileStructure, newDirectoryPath);

    var file = fileStructureUtils.findFile(oldDirectory, oldFilePath);
    _.remove(oldDirectory.files, file);
    deletePaths(file);
    newDirectory.files.push(file);

    transforms[extension](fileStructure, file, {
        oldName: oldName,
        newName: newName,
        oldFilePath: oldFilePath,
        newFilePath: newFilePath
    });
}

function createUniqueName (name, n) {
    return name + ' (' + n + ')';
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

    updateFileReferences(fileStructure, oldFilePath, newFilePath, 'components', oldName, newName);
    updateIdentifiers(fileStructure, oldFilePath, pascal(oldName), pascal(newName));
    updateIdentifiers(fileStructure, oldFilePath, camel(oldName), camel(newName));
    updateIdentifiersInFile(file, pascal(oldName), pascal(newName));
    updateIdentifiersInFile(file, camel(oldName), camel(newName));
    updateNameInComment(file, null, oldName, newName);
}

function updateFileReferences (fileStructure, oldFilePath, newFilePath, type, oldName, newName) {
    var usagePaths = fileStructure.usages[oldFilePath];
    _.each(usagePaths, function (usagePath) {
        var file = fileStructureUtils.findFile(fileStructure, usagePath);
        var oldRequirePath = getRelativeRequirePath(path.dirname(usagePath), oldFilePath);
        var newRequirePath = getRelativeRequirePath(path.dirname(usagePath), newFilePath);
        _.each(esquery(file.ast, 'CallExpression[callee.name="require"] Literal[value="' + oldRequirePath + '"]'), function (requirePathLiteral) {
            requirePathLiteral.value = newRequirePath;
            requirePathLiteral.raw = '\'' + newRequirePath + '\'';
        });
        updateNameInComment(file, type, oldName, newName);
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

function updateNameInComment (file, type, oldName, newName) {
    var comment = _.first(file.ast.comments);
    var metaData = JSON.parse(comment.value);
    var item = metaData;
    if (type) {
        item = _.find(metaData[type], { name: oldName });
    }
    if (item) {
        item.name = newName;
    }
    comment.value = JSON.stringify(metaData, null, '    ');
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

    updateFileReferences(fileStructure, oldFilePath, newFilePath, 'mockData', oldName, newName);
    updateIdentifiers(fileStructure, oldFilePath, camel(oldName), camel(newName));
}
