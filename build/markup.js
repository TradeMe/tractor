'use strict';

// Config:
var config = require('./config.js');

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');

module.exports = markup;

function markup () {
    return gulp.src(config.src + '*.html')
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
}
