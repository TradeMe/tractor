'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var path = require('path');

module.exports = _.defaults(getConfig(), require('../default.conf.js'));

function getConfig () {
    var configPath = path.join(process.cwd() + '/tractor.conf.js');
    return fs.existsSync(configPath) ? require(configPath) : {};
}
