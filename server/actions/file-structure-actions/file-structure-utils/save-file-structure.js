'use strict';

// Config:
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Dependencies:
var astUtils = require('../../../utils/ast-utils');
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = saveFileStructure;

function saveFileStructure (fileStructure) {
    var transform = _.compose([
        generateJavaScriptFiles,
        denormaliseFileStructure
    ]);
    return jsondir.json2dirAsync(transform(fileStructure), {
        nuke: true
    });
}

function generateJavaScriptFiles (fileStructure) {
    _(fileStructure.allFiles).filter(function (file) {
        var extension = constants.JAVASCRIPT_EXTENSION.replace(/\./g, '\\.');
        return new RegExp(extension + '$').test(file.path);
    })
        .each(astUtils.generateJS).value();
    return fileStructure;
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

