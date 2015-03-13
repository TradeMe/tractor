'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

module.exports = test;

function test (reportTaskDone) {
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
        .pipe(mocha())
        .pipe(istanbul.writeReports({
            dir: './reports'
        }))
        .on('end', reportTaskDone);
    });
}
