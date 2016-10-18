'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var ngAnnotate = require('gulp-ng-annotate');
var source = require('vinyl-source-stream');

// Errors:
var errorHandler = require('./utilities/error-handler');

module.exports = {
    bundle: bundle,
    init: init
};

function bundle () {
    return browserify({
        entries: ['./src/app/app.js']
    })
    .transform('brfs')
    .bundle()
    .on('error', errorHandler)
    .pipe(source('tractor.bundle.js'))
    .pipe(buffer())
    .pipe(ngAnnotate({
        add: true,
        single_quotes: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}

function init () {
    return gulp.src('./src/app/init.js')
    .pipe(gulp.dest('./dist/'));
}
