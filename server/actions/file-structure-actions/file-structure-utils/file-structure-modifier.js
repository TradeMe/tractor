'use strict';

// Config:
var config = require('../../../utils/get-config')();

// Utilities:
var errorHandler = require('../../../utils/error-handler');

// Dependencies:
var getFileStructure = require('./get-file-structure');
var saveFileStructure = require('./save-file-structure');

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
                fileStructure = preModifier(fileStructure, request);
                return saveFileStructure(fileStructure)
                .then(function () {
                    return getFileStructure(config.testDirectory);
                });
            }
            return fileStructure;
        })
        .then(function (fileStructure) {
            if (postModifier) {
                fileStructure = postModifier(fileStructure, request);
            }
            response.send(JSON.stringify(fileStructure));
        })
        .catch(function (error) {
            console.log(error);
            errorHandler(response, error, 'Operation failed.');
        });
    };
}
