'use strict';

// Config:
var config = require('../utils/create-config')();

module.exports = getConfig;

function getConfig (request, response) {
    response.send(JSON.stringify(config));
}
