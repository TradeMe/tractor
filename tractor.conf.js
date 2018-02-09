'use strict';

module.exports = {
    port: 4444,
    environments: [
        'http://localhost:4444'
    ],
    cucumber: {
        reportsDirectory: './reports/tractor'
    },
    pageObjects: {
        directory: './packages/tractor-ui/src/app'
    }
};
