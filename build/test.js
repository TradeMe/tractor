'use strict';

// Utilities:
var gulp = require('gulp');
var karma = require('karma').server;

// Dependencies:
var babel = require('babel/register');
var istanbul = require('gulp-istanbul');
var isparta = require('isparta');
var mocha = require('gulp-mocha');

module.exports = {
    server: server,
    client: client
};

function server (reportTaskDone) {
    gulp.src([
        'server/**/*.js',
        '!server/**/*.spec.js',
        '!server/*.js',
        '!server/cli/init/base-file-sources/*'
    ])
    .pipe(istanbul({
        instrumenter: isparta.Instrumenter,
        includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
        gulp.src('server/**/*.js')
        .pipe(mocha({reporter: 'mocha-jenkins-reporter',
                    reporterOptions:{
                        junit_report_name: 'Tractor Server Unit Tests',
                        junit_report_path: './reports/server/junit.xml',
                        junit_report_stack: 1
                    }}).on('error', function (error) {
            console.log(error);
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

        reporters: ['progress', 'coverage', 'junit'],
        coverageReporter: {
            reporters: [{
                type: 'lcov',
                dir: 'reports/client'
            }, {
                type: 'text',
                dir: 'reports/client'
            }]
        },
        junitReporter: {
            outputDir: 'reports/client',
            suite: 'Client Unit Tests',
            useBrowserName: false
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
