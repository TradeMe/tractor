'use strict';

// Utilities:
var path = require('path');

// Config:
var config = require('../../utils/get-config')();
var constants = require('../../constants');

module.exports = getComponentPath;

function getComponentPath (request, response) {
    var componentPath;

    if (request.query.path) {
        componentPath = request.query.path;
    } else {
        var componentFileName = request.query.name + constants.COMPONENTS_EXTENSION;
        componentPath = path.join(config.testDirectory, constants.COMPONENTS_DIR, componentFileName);
    }

    response.send(JSON.stringify({
        path: componentPath
    }));
}
