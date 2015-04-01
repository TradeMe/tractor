'use strict';

// Config:
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Dependencies:
var astUtils = require('../../../utils/ast-utils');
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = getFileStructure;

function getFileStructure (directoryPath) {
    return jsondir.dir2jsonAsync(directoryPath, {
        attributes: ['content']
    })
    .then(function (fileStructure) {
        var transform = _.compose([
            normaliseFileStructure,
            findAllFiles,
            parseJavaScriptFiles,
            getFileUsages
        ]);
        return transform(fileStructure);
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

function findAllFiles (directory) {
    _.each(directory.directories, function (directory) {
        findAllFiles(directory, []);
    });
    directory.allFiles = _.reduce(directory.directories, function (all, directory) {
        return all.concat(directory.allFiles || []);
    }, []).concat(directory.files || []);
}

function parseJavaScriptFiles (fileStructure) {
    _(fileStructure.allFiles).filter(function (file) {
        var extension = constants.JAVASCRIPT_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    })
    .each(astUtils.parseJS)
    .value();
    return fileStructure;
}

function getFileUsages (fileStructure)  {
    var usages = {};
    var match;
    _.each(fileStructure.allFiles, function (file) {
        var findRequires = /require\([\'\"]([\.\/].*?)[\'\"]\)/gm;
        while ((match = findRequires.exec(file.content)) !== null) {
            var usedPath = path.resolve(path.dirname(file.path), _.last(match));
            usages[usedPath] = usages[usedPath] || [];
            usages[usedPath].push(file.path);
        }
    });
    fileStructure.usages = usages;
    return fileStructure;
}
