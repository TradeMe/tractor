'use strict';

// Constants:
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var path = require('path');

// Dependencies:
var changeCase = require('change-case');
var camel = changeCase.camel;
var esquery = require('esquery');
var fileStructureModifier = require('../utils/file-structure-modifier');
var fileStructureUtils = require('../utils/file-structure-utils/file-structure-utils');
var pascal = changeCase.pascal;

// Errors:
var UnknownOperationError = require('../errors/UnknownOperationError');

var transforms = { };
transforms[constants.COMPONENTS_EXTENSION] = componentTransform;
transforms[constants.FEATURES_EXTENSION] = featureTransform;
transforms[constants.STEP_DEFINITIONS_EXTENSION] = _.noop;
transforms[constants.MOCK_DATA_EXTENSION] = mockDataTransform;

module.exports = init;

function init () {
    return fileStructureModifier.create({
        preSave: editItemPath
    });
}

function editItemPath (fileStructure, request) {
    var body = request.body;
    var isDirectory = body.isDirectory;
    var oldName = body.oldName;
    var newName = body.newName;
    var oldDirectoryPath = body.oldDirectoryPath;
    var newDirectoryPath = body.newDirectoryPath;

    if (isDirectory && oldName && newName) {
        return renameDirectory(fileStructure, request.body);
    } else if (!isDirectory && oldName && newName) {
        return renameFile(fileStructure, request.body);
    } else if (!isDirectory && oldDirectoryPath && newDirectoryPath) {
        return moveFile(fileStructure, request.body);
    } else {
        throw new UnknownOperationError('Unknown operation');
    }
}

function renameDirectory (fileStructure, body) {
    var oldName = body.oldName;
    var newName = body.newName;
    var directoryPath = body.directoryPath;

    var extension = fileStructureUtils.getExtension(directoryPath);

    var oldPath = path.join(directoryPath, oldName);
    var newPath = path.join(directoryPath, newName);

    var directory = fileStructureUtils.findDirectory(fileStructure, oldPath);
    var existingDirectory = fileStructureUtils.findDirectory(fileStructure, newPath);

    var numberOfDirectoriesWithSameName = 0;
    var originalNewName = newName;
    while (existingDirectory) {
        numberOfDirectoriesWithSameName += 1;
        newName = createUniqueName(originalNewName, numberOfDirectoriesWithSameName + 1);
        newPath = path.join(directoryPath, newName);
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
    return fileStructure;
}

function renameFile (fileStructure, body) {
    var oldName = body.oldName;
    var newName = body.newName;
    var directoryPath = body.directoryPath;

    var extension = fileStructureUtils.getExtension(directoryPath);

    var oldFilePath = path.join(directoryPath, oldName + extension);
    var newFilePath = path.join(directoryPath, newName + extension);

    var directory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    var file = fileStructureUtils.findFile(directory, oldFilePath);
    var existingFile = fileStructureUtils.findFile(directory, newFilePath);

    var numberOfFilesWithSameName = 0;
    var originalNewName = newName;
    while (existingFile) {
        numberOfFilesWithSameName += 1;
        newName = createUniqueName(originalNewName, numberOfFilesWithSameName + 1);
        newFilePath = path.join(directoryPath, newName + extension);
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
    return fileStructure;
}

function moveFile (fileStructure, body) {
    var name = body.name;
    var oldDirectoryPath = body.oldDirectoryPath;
    var newDirectoryPath = body.newDirectoryPath;

    var extension = fileStructureUtils.getExtension(oldDirectoryPath);

    var oldFilePath = path.join(oldDirectoryPath, name + extension);
    var newFilePath = path.join(newDirectoryPath, name + extension);

    var oldDirectory = fileStructureUtils.findDirectory(fileStructure, oldDirectoryPath);
    var newDirectory = fileStructureUtils.findDirectory(fileStructure, newDirectoryPath);

    var file = fileStructureUtils.findFile(oldDirectory, oldFilePath);
    _.remove(oldDirectory.files, file);
    deletePaths(file);
    newDirectory.files.push(file);

    transforms[extension](fileStructure, file, {
        oldName: name,
        newName: name,
        oldFilePath: oldFilePath,
        newFilePath: newFilePath
    });
    return fileStructure;
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

    updateFileReferences(fileStructure, 'components', oldFilePath, newFilePath, oldName, newName);
    updateIdentifiers(fileStructure, oldFilePath, pascal(oldName), pascal(newName));
    updateIdentifiers(fileStructure, oldFilePath, camel(oldName), camel(newName));
    updateIdentifiersInFile(file, pascal(oldName), pascal(newName));
    updateIdentifiersInFile(file, camel(oldName), camel(newName));
    updateNameInComment(file, null, oldName, newName);
}

function updateFileReferences (fileStructure, type, oldFilePath, newFilePath, oldName, newName) {
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
        item = _.find(item[type], { name: oldName });
    }
    item.name = newName;
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

    updateFileReferences(fileStructure, 'mockData', oldFilePath, newFilePath, oldName, newName);
    updateIdentifiers(fileStructure, oldFilePath, camel(oldName), camel(newName));
}
