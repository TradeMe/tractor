'use strict';
const { tractor } = require('@tractor/core');
const { config } = require('../../../protractor.conf');

// TODO: Firefox does not seem to work anymore
// config.multiCapabilities.push({
//     browserName: 'firefox',
//     shardTestFiles: true,
//     maxInstances: 2,
//     'moz:firefoxOptions': {
//         args: [
//             '--headless'
//         ]
//     }
// });

exports.config = tractor('../tractor.conf.js').plugin(config);
