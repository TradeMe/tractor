'use strict';

// Utilities:
var path = require('path');

// Config:
var config = require('../../utils/get-config')();
var constants = require('../../constants');

module.exports = getMockDataPath;

function getMockDataPath (request, response) {
    var stepDefinitionPath;

    if (request.query.path) {
        stepDefinitionPath = request.query.path;
    } else {
        var stepDefinitionFileName = request.query.name + constants.STEP_DEFINITIONS_EXTENSION;
        stepDefinitionPath = path.join(config.testDirectory, constants.STEP_DEFINITIONS_DIR, stepDefinitionFileName);
    }

    response.send(JSON.stringify({
        path: stepDefinitionPath
    }));
}
