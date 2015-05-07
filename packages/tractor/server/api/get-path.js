'use strict';

// Utilities:
var path = require('path');

// Config:
var config = require('../utils/create-config')();
var constants = require('../constants');

module.exports = getPath;

function getPath (request, response) {
    var type = request.param('type').toUpperCase();
    var extension = constants[type + '_EXTENSION'];
    var directoryName = constants[type + '_DIR'];

    var filePath = request.query.path;

    if (!filePath) {
        var fileName = request.query.name + extension;
        filePath = path.join(process.cwd(), config.testDirectory, directoryName, fileName);
    }

    response.send(JSON.stringify({
        path: filePath
    }));
}
