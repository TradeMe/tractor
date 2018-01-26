'use strict';

// Utilities:
var gulp = require('gulp');

module.exports = pageObjects;

function pageObjects () {
    return gulp.src('./src/app/**/*.po.js')
    .pipe(gulp.dest('./dist/page-objects/'));
}
