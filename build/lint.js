'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var eslint = require('gulp-eslint');

module.exports = lint;

function lint () {
    return gulp.src(['src/**/*.js', 'server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}
