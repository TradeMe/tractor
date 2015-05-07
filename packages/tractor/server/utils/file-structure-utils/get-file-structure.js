'use strict';

// Config:
var constants = require('../../constants');

// Utilities:
var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');

// Dependencies:
var esquery = require('esquery');
var jsondir = Promise.promisifyAll(require('jsondir'));
var parseJS = require('../parse-js');

module.exports = getFileStructure;

var componentExtension = constants.COMPONENTS_EXTENSION.replace(/\./g, '\\.');
var stepDefinitionExtension = constants.STEP_DEFINITIONS_EXTENSION.replace(/\./g, '\\.');
var COMPONENT_EXTENSION_REGEX = new RegExp(componentExtension + '$');
var STEP_DEFINITION_EXTENSION_REGEX = new RegExp(stepDefinitionExtension + '$');

function getFileStructure (directoryPath) {
    return jsondir.dir2jsonAsync(directoryPath, {
        attributes: ['content']
    })
    .then(function (fileStructure) {
        fileStructure = normaliseFileStructure(fileStructure);
        findAllFiles(fileStructure);
        parseJavaScriptFiles(fileStructure);
        getFileUsages(fileStructure);
        return fileStructure;
    });
}

function normaliseFileStructure (directory) {
    var skip = ['name', '-name', 'path', '-path', '-type', 'files', 'directories', 'isDirectory', 'isTopLevel'];

    directory.files = directory.files || [];
    directory.directories = directory.directories || [];

    _.each(directory, function (item, name) {
        if (item['-type'] === 'd') {
            // Directory:
            item.isDirectory = true;
            item.name = name;
            item.path = item['-path'];
            directory.directories.push(normaliseFileStructure(item));
            delete directory[name];
        } else if (!_.contains(skip, name)) {
            // File:
            // Skip hidden files (starting with ".")...
            if (!/^\./.test(name)) {
                item.name = _.last(/(.*?)\./.exec(name));
                item.path = item['-path'];
                item.content = item['-content'];
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
    _.forEach(directory.directories, findAllFiles);
    directory.allFiles = _.reduce(directory.directories, function (all, directory) {
        return all.concat(directory.allFiles);
    }, []).concat(directory.files || []);
}

function parseJavaScriptFiles (fileStructure) {
    // TODO 'Untested, needs DI'
    _(fileStructure.allFiles)
    .filter(function (file) {
        return COMPONENT_EXTENSION_REGEX.test(file.path) || STEP_DEFINITION_EXTENSION_REGEX.test(file.path);
    })
    .each(parseJS);
}

function getFileUsages (fileStructure)  {
    var usages = {};
    _.each(fileStructure.allFiles, function (file) {
        var requirePaths = esquery(file.ast, 'CallExpression[callee.name="require"] Literal');
        _.each(requirePaths, function (requirePath) {
            var usedPath = path.resolve(path.dirname(file.path), requirePath.value);
            usages[usedPath] = usages[usedPath] || [];
            usages[usedPath].push(file.path);
        });
    });
    fileStructure.usages = usages;
}
