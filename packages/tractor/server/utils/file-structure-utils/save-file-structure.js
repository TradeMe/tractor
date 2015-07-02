'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs.extra'));

// Dependencies:
var getExtension = require('./get-extension');
var javascriptGenerator = require('../javascript-generator');
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = saveFileStructure;

function saveFileStructure (fileStructure) {
    var fromPath = fileStructure.path;
    var copyPath = path.resolve(fromPath, '../backup-' + Date.now());
    return fs.copyRecursiveAsync(fromPath, copyPath)
    .then(function () {
        generateJavaScriptFiles(fileStructure);
        fileStructure = denormaliseFileStructure(fileStructure);
        return jsondir.json2dirAsync(fileStructure, {
            nuke: true
        });
    })
    .then(function () {
        return fs.removeAsync(copyPath);
    });
}

function generateJavaScriptFiles (fileStructure) {
    _(fileStructure.allFiles)
    .filter(function (file) {
        return !!file.ast;
    })
    .each(javascriptGenerator.generate)
    .value();
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
        file['-content'] = file.content;
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
