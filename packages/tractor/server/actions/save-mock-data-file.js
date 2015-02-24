'use strict';

// Config:
var config = require('../utils/get-config');

// Utilities:
var constants = require('../constants');
var log = require('../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

module.exports = (function () {
    return function (req, res) {
        var name = req.body.name + constants.MOCK_DATA_EXTENSION;

        var dataPath = path.join(config.testDirectory, constants.MOCK_DATA_DIR, name);
        return fs.writeFileAsync(dataPath, req.body.data)
        .then(function () {
            res.send(JSON.stringify({
                message: name + ' saved successfully.'
            }));
        })
        .catch(function (error) {
            log.error(error);
            res.status(500);
            res.send(JSON.stringify({
                error: 'Saving ' + name + ' failed.'
            }));
        });
    };
})();
