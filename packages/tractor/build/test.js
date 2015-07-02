'use strict';

// Utilities:
var gulp = require('gulp');
var karma = require('karma').server;

// Dependencies:
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

module.exports = {
    server: server,
    client: client
};

function server (reportTaskDone) {
    gulp.src([
        'server/**/*.js',
        '!server/**/*.spec.js',
        '!server/**/*.mock.js',
        '!server/*.js',
        '!server/**/*Error.js',
        '!server/cli/init/base_file_sources/*',
        '!server/utils/logging.js'
    ])
    .pipe(istanbul({
        includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
        gulp.src(['server/**/*.spec.js'])
        .pipe(mocha().on('error', function (error) {
            this.destroy();
            reportTaskDone();
        }))
        .pipe(istanbul.writeReports({
            dir: './reports/server'
        }))
        .on('end', reportTaskDone);
    });
}

function client (reportTaskDone) {
    karma.start({
        frameworks: ['browserify', 'mocha', 'sinon-chai', 'dirty-chai'],
        browsers: ['Chrome'],

        port: 9876,

        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [{
                type: 'lcov',
                dir: 'reports/client'
            }, {
                type: 'text',
                dir: 'reports/client'
            }]
        },

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
            transform: ['brfs', 'browserify-shim', ['browserify-istanbul', {
                ignore: ['**/*.spec.js', '**/*.mock.js', '**/Errors/*.js']
            }]]
        }
    }, function () {
        reportTaskDone();
    });
}
