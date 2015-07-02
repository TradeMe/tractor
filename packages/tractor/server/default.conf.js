'use strict';

// Utilities:
var _ = require('lodash');

module.exports = {
    testDirectory: './e2e_tests',
    port: 4000,
    environments: [
        'http://localhost:8080'
    ],
    beforeProtractor: _.noop,
    afterProtractor: _.noop
};
