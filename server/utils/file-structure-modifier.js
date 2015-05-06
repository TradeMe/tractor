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

function create (options) {
    var preSave = options && options.preSave;
    var postSave = options && options.postSave;
    var preSend = options && options.preSend;

    return function (request, response) {
        return fileStructureUtils.getFileStructure(config.testDirectory)
        .then(function (fileStructure) {
            if (preSave) {
                return Promise.resolve(preSave(fileStructure, request))
                .then(function (fileStructure) {
                    return fileStructureUtils.saveFileStructure(fileStructure);
                })
                .then(function () {
                    return fileStructureUtils.getFileStructure(config.testDirectory);
                });
            }
            return fileStructure;
        })
        .then(function (fileStructure) {
            if (postSave) {
                return Promise.resolve(postSave(fileStructure, request))
                .then(function (fileStructure) {
                    return fileStructureUtils.saveFileStructure(fileStructure);
                })
                .then(function () {
                    return fileStructureUtils.getFileStructure(config.testDirectory);
                });
            }
            return fileStructure;
        })
        .then(function (fileStructure) {
            if (preSend) {
                return preSend(fileStructure);
            }
            return fileStructure;
        })
        .then(function (fileStructure) {
            response.send(JSON.stringify(fileStructure));
        })
        .catch(function (error) {
            console.log(error);
            errorHandler(response, error, 'Operation failed.');
        });
    };
}
