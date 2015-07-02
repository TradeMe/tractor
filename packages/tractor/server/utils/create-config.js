'use strict';

// Config:
var defaultConfig = require('../default.conf.js');

// Utilities:
var _ = require('lodash');
var path = require('path');

module.exports = createConfig;

function createConfig () {
    var configPath = path.join(process.cwd() + '/tractor.conf.js');
    var config;
    try {
        config = require(configPath);
    } catch (e) {
        config = {};
    }
    return _.defaults(config, defaultConfig);
}
