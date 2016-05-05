'use strict';

// Config:
var config       = require('./config.js');

// Utilities:
var gulp = require('gulp');

// Dependencies:
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var cssimport    = require('gulp-cssimport');
var filter       = require('gulp-filter');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-ruby-sass');

// Erros:
var errorHandler = require('./utilities/error-handler');

module.exports = styles;

function styles () {
    var cssFilter = filter('*.css', {
        restore:true
    });

    return sass(config.stylesDir + '*.scss', {
        sourcemap: true
    })
    .on('error', errorHandler)
    .pipe(sourcemaps.write('.', {
        includeContent: false,
    }))
    .pipe(cssFilter)
    .pipe(autoprefixer({
        browsers: ['last 2 version']
    }))
    .pipe(cssFilter.restore)
    .pipe(cssimport())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
}
