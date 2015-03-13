'use strict';

// Config:
var config = require('./config.js');

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');

module.exports = fonts;

function fonts () {
    return gulp.src(config.src + 'fonts/*')
    .pipe(gulp.dest(config.dest + 'fonts/'));
}
