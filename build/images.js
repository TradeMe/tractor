'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');
var changed = require('gulp-changed');

module.exports = images;

function images () {
    return gulp.src('./src/images/*')
    .pipe(changed('./dist/images/'))
    .pipe(gulp.dest('./dist/images/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}
