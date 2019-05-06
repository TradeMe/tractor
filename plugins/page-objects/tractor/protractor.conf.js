'use strict';
const { tractor } = require('@tractor/core');
const { config } = require('../../../protractor.conf');

exports.config = tractor('../tractor.conf.js').plugin(config);
