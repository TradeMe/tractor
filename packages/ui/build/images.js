'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var browserSync = require('browser-sync');
var changed = require('gulp-changed');

module.exports = images;

function images () {
    return gulp.src('./src/images/*')
    .pipe(changed('./dist/app/images/'))
    .pipe(gulp.dest('./dist/app/images/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}
