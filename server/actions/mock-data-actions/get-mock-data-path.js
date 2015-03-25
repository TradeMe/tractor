'use strict';

// Utilities:
var path = require('path');

// Config:
var config = require('../../utils/get-config')();
var constants = require('../../constants');

module.exports = getMockDataPath;

function getMockDataPath (request, response) {
    var mockDataPath;

    if (request.query.path) {
        mockDataPath = request.query.path;
    } else {
        var mockDataFileName = request.query.name + constants.MOCK_DATA_EXTENSION;
        mockDataPath = path.join(config.testDirectory, constants.MOCK_DATA_DIR, mockDataFileName);
    }

    response.send(JSON.stringify({
        path: mockDataPath
    }));
}
