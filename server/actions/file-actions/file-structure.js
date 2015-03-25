'use strict';

// Utilities:
var _ = require('lodash');
var constants = require('../../constants');
var errorHandler = require('../../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Dependenices:
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = {
    createModifier: createModifier,
    deletePaths: deletePaths,
    findDirectory: findDirectory,
    findContainingDirectory: findContainingDirectory,
    getFileNames: getFileNames,
    getExtensionFromRoot: getExtensionFromRoot,
    noop: noop
};

function createModifier (preModifier, postModifier, errorMessage) {
    return function (request, response) {
        jsondir.dir2jsonAsync(request.body.root, {
            attributes: ['content']
        })
        .then(function (fileStructure) {
            fileStructure = preModifier(fileStructure, request);
            return jsondir.json2dirAsync(fileStructure, {
                nuke: true
            });
        })
        .then(function () {
            return jsondir.dir2jsonAsync(request.body.root, {
                attributes: ['content']
            });
        })
        .then(function (newFileStructure) {
            newFileStructure = organiseFileStructure(newFileStructure, newFileStructure);
            response.send(JSON.stringify(postModifier(newFileStructure, request)));
        })
        .catch(function (error) {
            console.log(error);
            errorHandler(response, error, errorMessage);
        });
    };
}

function organiseFileStructure (directory, fileStructure) {
    fileStructure.allFiles = fileStructure.allFiles || [];

    var skip = ['name', '-name', 'path', '-path', '-type', 'allFiles', 'files', 'directories', 'isDirectory'];
    _.each(directory, function (item, name) {
        if (item['-type'] === 'd') {
            // Directory:
            directory.directories = directory.directories || [];
            item.isDirectory = true;
            item.name = name;
            item.path = item['-path'];
            directory.directories.push(organiseFileStructure(item, fileStructure));

            delete directory[name];
        } else if (!_.contains(skip, name)) {
            // File:
            // Skip hidden files (starting with ".")...
            if (!/^\./.test(name)) {
                directory.files = directory.files || [];
                item.name = _.last(/(.*?)\./.exec(name));
                item.path = item['-path'];
                item.content = item['-content'];
                directory.files.push(item);
                fileStructure.allFiles.push(item);
            }

            delete directory[name];
        }

        delete item['-content'];
        delete item['-path'];
        delete item['-type'];
    });
    directory.path = directory['-path'];

    delete directory['-name'];
    delete directory['-path'];
    delete directory['-type'];

    return directory;
}

function deletePaths (directory) {
    delete directory['-path'];
    _.each(directory, function (item) {
        delete item['-path'];
        if (item['-type'] === 'd') {
            item = deletePaths(item);
        }
    });
    return directory;
}

function findDirectory (directory, itemPath) {
    var dir;
    if (directory['-path'] === itemPath) {
        return directory;
    }
    _.each(directory, function (item) {
        if (!dir && item['-type'] === 'd') {
            if (item['-path'] === itemPath) {
                dir = item;
            } else {
                dir = findDirectory(item, itemPath);
            }
        }
    });
    return dir;
}

function findContainingDirectory (directory, itemPath) {
    return findDirectory(directory, path.dirname(itemPath));
}

function getFileNames (directoryPath, extension) {
    return jsondir.dir2jsonAsync(directoryPath)
    .then(function (fileStructure) {
        return getFileNamesInDirectory(fileStructure)
        .filter(function (name) {
            return !extension || name.match(new RegExp(extension + '$'));
        });
    });
}

function getFileNamesInDirectory (directory, names) {
    names = names || [];
    _.each(directory, function (item, name) {
        if (item['-type'] === 'd') {
            // Directory:
            getFileNamesInDirectory(item, names);
        } else if (name !== '-type' && name !== '-path') {
            // File:
            names.push(name);
        }
    });
    return names;
}

function getExtensionFromRoot (root) {
    var rootDirectoryName = path.basename(root);
    var extensionKey = rootDirectoryName.toUpperCase() + '_EXTENSION';
    return constants[extensionKey];
}

function noop (fileStructure) {
    return fileStructure;
}
