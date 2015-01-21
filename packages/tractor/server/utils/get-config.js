'use strict';

// Utilities:
var _ = require('lodash');

module.exports = _.defaults(require('../../tractor.conf'), require('../default.conf.js'));
