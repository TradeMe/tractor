'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');

module.exports = fonts;

function fonts () {
    return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/app/fonts/'));
}
