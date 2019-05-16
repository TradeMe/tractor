'use strict';

module.exports = {
    port: 4800,
    environments: [
        'http://localhost:4800'
    ],
    plugins: [
        'accessibility',
        'browser',
        'mocha-specs',
        'page-objects'
    ],
    pageObjects: {
        directory: './src/app'
    }
};
