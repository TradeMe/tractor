'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');

module.exports = markup;

function markup () {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist/app/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}
