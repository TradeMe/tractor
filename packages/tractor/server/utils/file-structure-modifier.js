'use strict';

// Config:
var config = require('./create-config')();

// Utilities:
var errorHandler = require('./error-handler');
var Promise = require('bluebird');

// Dependencies:
var fileStructureUtils = require('./file-structure-utils/file-structure-utils');

module.exports = {
    create: create
};

// Cache:
var cache = null;

function create (options) {
    var preSave = options && options.preSave;
    var postSave = options && options.postSave;
    var preSend = options && options.preSend;

    return function (request, response) {
        if (cache && !preSave && !postSave) {
            response.send(JSON.stringify(cache));
            return Promise.resolve(cache);
        }

        return fileStructureUtils.getFileStructure(config.testDirectory)
        .then(createModifierHandler(preSave, request))
        .then(createModifierHandler(postSave, request))
        .then(function (fileStructure) {
            if (preSend) {
                return preSend(fileStructure);
            }
            return fileStructure;
        })
        .then(function (fileStructure) {
            cache = fileStructure;
            response.send(JSON.stringify(fileStructure));
        })
        .catch(function (error) {
            errorHandler(response, error, 'Operation failed.');
        });
    };
}

function createModifierHandler (modifier, request) {
    return function (fileStructure) {
        if (modifier) {
            return Promise.resolve(modifier(fileStructure, request))
            .then(function (fileStructure) {
                return fileStructureUtils.saveFileStructure(fileStructure);
            })
            .then(function () {
                return fileStructureUtils.getFileStructure(config.testDirectory);
            });
        }
        return fileStructure;
    };
}
