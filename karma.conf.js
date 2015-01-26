'use strict';

module.exports = function (karma) {
    karma.set({
        frameworks: ['browserify', 'mocha', 'chai'],
        browsers: ['Chrome'],

        port: 9876,

        reporters: ['progress'],
        logLevel: karma.LOG_INFO,
        colors: true,
        autoWatch: false,
        singleRun: true,

        files: [
            'src/**/*.spec.js'
        ],

        preprocessors: {
            'src/**/*.spec.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: ['brfs', 'browserify-shim']
        }
    });
};
