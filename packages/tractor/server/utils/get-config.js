'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = getConfig;

function getConfig () {
    var configPath = path.join(process.cwd() + '/tractor.conf.js');
    var config = fs.existsSync(configPath) ? require(configPath) : {};
    return _.defaults(config, require('../default.conf.js'));
}
