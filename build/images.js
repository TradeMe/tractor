'use strict';

// Config:
var config = require('./config.js');

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');
var changed = require('gulp-changed');

module.exports = images;

function images () {
    return gulp.src(config.src + '/images/*')
    .pipe(changed(config.dest + '/images/'))
    .pipe(gulp.dest(config.dest + '/images/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}
