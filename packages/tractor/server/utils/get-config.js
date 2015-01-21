'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var path = require('path');

module.exports = _.defaults(require(path.join(process.cwd() + '/tractor.conf.js')), require('../default.conf.js'));
