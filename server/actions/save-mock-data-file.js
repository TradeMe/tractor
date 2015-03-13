'use strict';

// Utilities:
var constants = require('../constants');
var errorHandler = require('../utils/error-handler');
var path = require('path');
var Promise = require('bluebird');

// Config:
var config = require('../utils/get-config')();

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));

module.exports = saveMockDataFile;

function saveMockDataFile (request, response) {
    var name = request.body.name + constants.MOCK_DATA_EXTENSION;

    var dataPath = path.join(config.testDirectory, constants.MOCK_DATA_DIR, name);
    return fs.writeFileAsync(dataPath, request.body.data)
    .then(function () {
        response.send(JSON.stringify({
            message: '"' + name + '" saved successfully.'
        }));
    })
    .catch(function (error) {
        errorHandler(response, error, 'Saving "' + name + '" failed.');
    });
}
