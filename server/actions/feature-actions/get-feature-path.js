'use strict';

// Utilities:
var path = require('path');

// Config:
var config = require('../../utils/get-config')();
var constants = require('../../constants');

module.exports = getFeaturePath;

function getFeaturePath (request, response) {
    var featurePath;

    if (request.query.path) {
        featurePath = request.query.path;
    } else {
        var featureFileName = request.query.name + constants.FEATURES_EXTENSION;
        featurePath = path.join(config.testDirectory, constants.FEATURES_DIR, featureFileName);
    }

    response.send(JSON.stringify({
        path: featurePath
    }));
}
