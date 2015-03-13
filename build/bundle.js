'use strict';

// Config:
var config = require('./config.js');
var packageJSON = require('../package.json');

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var ngAnnotate = require('gulp-ng-annotate');
var source = require('vinyl-source-stream');

// Errors:
var error = require('./utilities/error-handler');

module.exports = bundle;

function bundle () {
    return browserify({
        entries: [config.appDir + 'app.js']
    })
    .transform('brfs')
    .bundle()
    .on('error', error)
    .pipe(source(packageJSON.name + '.bundle.js'))
    .pipe(buffer())
    .pipe(ngAnnotate({
        add: true,
        single_quotes: true
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
}
