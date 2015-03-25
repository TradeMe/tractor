'use strict';

// Utilities:
var errorHandler = require('../../utils/error-handler');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));

module.exports = saveMockDataFile;

function saveMockDataFile (request, response) {
    var name = request.body.name;
    return fs.writeFileAsync(request.body.path, request.body.data)
    .then(function () {
        response.send(JSON.stringify({
            message: '"' + name + '" saved successfully.'
        }));
    })
    .catch(function (error) {
        errorHandler(response, error, 'Saving "' + name + '" failed.');
    });
}
