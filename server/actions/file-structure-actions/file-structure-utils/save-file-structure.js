'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Dependencies:
var generateJS = require('./generate-js');
var fileStructureUtils = require('../../../utils/file-structure');
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = saveFileStructure;

function saveFileStructure (fileStructure) {
    generateJavaScriptFiles(fileStructure);
    fileStructure = denormaliseFileStructure(fileStructure);
    return jsondir.json2dirAsync(fileStructure, {
        nuke: true
    });
}

function generateJavaScriptFiles (fileStructure) {
    _(fileStructure.allFiles).filter(function (file) {
        return !!file.ast;
    })
    .each(generateJS);
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
        directory[file.name + fileStructureUtils.getExtension(directory.path)] = file;

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
