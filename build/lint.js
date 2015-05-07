'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var eslint = require('gulp-eslint');

module.exports = {
    server: server,
    client: client
};

function server () {
    return gulp.src(['server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}

function client () {
    return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}
