'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var eslint = require('gulp-eslint');

module.exports = client;

function client () {
    return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}
