'use strict';

// Config:
var config = require('../utils/get-config')();

module.exports = getConfig;

function getConfig (request, response) {
    response.send(JSON.stringify(config));
}
