'use strict';

// Config:
var config = require('./get-config')();
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var errorHandler = require('./error-handler');
var path = require('path');
var Promise = require('bluebird');

// Dependencies:
var astUtils = require('./ast-utils');
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = {
    createModifier: createModifier,
    findDirectory: findDirectory,
    findFile: findFile,
    getExtension: getExtension,
    getFileNames: getFileNames
};

function createModifier (options) {
    var preModifier = options && options.pre;
    var postModifier = options && options.post;

    return function (request, response) {
        getFileStructure(config.testDirectory)
        .then(function (fileStructure) {
            if (preModifier) {
                var fileStructure = preModifier(fileStructure, request);
                return saveFileStructure(fileStructure)
                .then(function () {
                    return fileStructure;
                });
            }
            return fileStructure;
        })
        .then(function (newFileStructure) {
            newFileStructure = postModifier ? postModifier(newFileStructure, request) : newFileStructure;
            response.send(JSON.stringify(newFileStructure));
        })
        .catch(function (error) {
            console.log(error);
            errorHandler(response, error, 'Operation failed.');
        });
    };
}

function getFileStructure (directoryPath) {
    return jsondir.dir2jsonAsync(directoryPath, {
        attributes: ['content']
    })
    .then(function (fileStructure) {
        fileStructure = normaliseFileStructure(fileStructure);
        fileStructure.allFiles = findAllFiles(fileStructure);
        fileStructure = parseJavaScriptFiles(fileStructure);
        return getFileUsages(fileStructure);
    });
}

function saveFileStructure (fileStructure) {
    fileStructure = generateJavaScriptFiles(fileStructure);
    return jsondir.json2dirAsync(denormaliseFileStructure(fileStructure), {
        nuke: true
    });
}

function normaliseFileStructure (directory, fileStructure) {
    fileStructure = fileStructure || directory;

    var skip = ['name', '-name', 'path', '-path', '-type', 'files', 'directories', 'isDirectory', 'isTopLevel'];
    _.each(directory, function (item, name) {
        if (item['-type'] === 'd') {
            // Directory:
            item.isDirectory = true;
            item.name = name;
            item.path = item['-path'];
            directory.directories = directory.directories || [];
            directory.directories.push(normaliseFileStructure(item, fileStructure));
            delete directory[name];
        } else if (!_.contains(skip, name)) {
            // File:
            // Skip hidden files (starting with ".")...
            if (!/^\./.test(name)) {
                item.name = _.last(/(.*?)\./.exec(name));
                item.path = item['-path'];
                item.content = item['-content'];
                directory.files = directory.files || [];
                directory.files.push(item);
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

function findAllFiles (directory, allFiles) {
    _.each(directory.directories, function (directory) {
        directory.allFiles = findAllFiles(directory, []);
    });
    allFiles = _.reduce(directory.directories, function (all, directory) {
        return all.concat(directory.allFiles || []);
    }, []);
    return allFiles.concat(directory.files || []);
}

function denormaliseFileStructure (directory) {
    if (directory.name) {
        directory['-name'] = directory.name;
    }
    if (directory.path) {
        directory['-path'] = directory.path;
    }
    directory['-type'] = 'd';

    _.forEach(directory.files, function (file) {
        if (file.path) {
            file['-path'] = file.path;
        }
        if (file.content) {
            file['-content'] = file.content;
        }
        file['-type'] = '-';
        directory[file.name + getExtension(directory.path)] = file;

        delete file.path;
        delete file.content;
        delete file.name;
        delete file.ast;
        delete file.tokens;
    });

    _.forEach(directory.directories, function (subDirectory) {
        directory[subDirectory.name] = denormaliseFileStructure(subDirectory);
    });

    delete directory.name;
    delete directory.path;
    delete directory.files;
    delete directory.directories;
    delete directory.allFiles;
    delete directory.usages;
    delete directory.isDirectory;
    return directory;
}

function parseJavaScriptFiles (fileStructure) {
    _(fileStructure.allFiles).filter(function (file) {
        var extension = constants.JAVASCRIPT_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    })
    .each(astUtils.parseJS).value();
    return fileStructure;
}

function generateJavaScriptFiles (fileStructure) {
    _(fileStructure.allFiles).filter(function (file) {
        var extension = constants.JAVASCRIPT_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    })
    .each(astUtils.generateJS).value();
    return fileStructure;
}

function findDirectory (directory, directoryPath) {
    if (directory.path === directoryPath) {
        return directory;
    }
    var dir;
    _.each(directory.directories, function (directory) {
        if (!dir) {
            if (directory.path === directoryPath) {
                dir = directory;
            } else {
                dir = findDirectory(directory, directoryPath);
            }
        }
    });
    return dir;
}

function findFile (directory, filePath) {
    return _.find(directory.allFiles, function (file) {
        return file.path === filePath;
    });
}

function getFileNames (directoryPath, extension) {
    return jsondir.dir2jsonAsync(directoryPath)
        .then(function (fileStructure) {
            return _.map(fileStructure.allFiles, function (file) {
                return file.name;
            })
                .filter(function (name) {
                    return !extension || name.match(new RegExp(extension + '$'));
                });
        });
}

function getExtension (directoryPath) {
    return _(directoryPath.split(path.sep))
    .map(function (directoryName) {
        var extensionKey = directoryName.toUpperCase() + '_EXTENSION';
        return constants[extensionKey];
    })
    .compact()
    .first() || '';
}

