'use strict';

// Config:
var config = require('../utils/get-config');

// Utilities:
var log = require('../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

module.exports = function (folderName, extension) {
    var EXTENSION_REGEX = new RegExp(extension + '$');

    return function (req, res) {
        return fs.readdirAsync(path.join(config.testDirectory, folderName))
        .then(function (fileNames) {
            fileNames = fileNames
            .filter(function (fileName) {
                return EXTENSION_REGEX.test(fileName);
            })
            .map(function (fileName) {
                return fileName.replace(EXTENSION_REGEX, '');
            });
            res.send(JSON.stringify(fileNames));
        })
        .catch(function (error) {
            log.error(error);
            res.status(500);
            res.send(JSON.stringify({
                message: 'Reading list of "' + extension + '" files failed.'
            }));
        });
    };
};
