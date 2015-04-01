'use strict';

// Config:
var config = require('../../../utils/get-config')();
var constants = require('../constants');

// Utilities:
var _ = require('lodash');
var errorHandler = require('../../../utils/error-handler');
var Promise = require('bluebird');

// Dependencies:
var getFileStructure = require('./get-file-structure');
var saveFileStructure = require('./save-file-structure');
var jsondir = Promise.promisifyAll(require('jsondir'));

module.exports = {
    create: create
};

function create (options) {
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
        .then(function (fileStructure) {
            if (postModifier) {
                fileStructure = postModifier(fileStructure, request)
            }
            response.send(JSON.stringify(fileStructure));
        })
        .catch(function (error) {
            errorHandler(response, error, 'Operation failed.');
        });
    };
}
