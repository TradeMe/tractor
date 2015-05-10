'use strict';

var noop = require('node-noop').noop;

module.exports = {
    testDirectory: './e2e_tests',
    port: 4000,
    environments: [
        'http://localhost:8080'
    ],
    beforeProtractor: noop,
    afterProtractor: noop
};
