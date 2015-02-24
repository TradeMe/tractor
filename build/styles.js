'use strict';

// Config:
var config       = require('./config.js');

// Dependencies:
var gulp         = require('gulp');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssimport    = require('gulp-cssimport');
var browserSync  = require('browser-sync');

// Erros:
var error = require('./utilities/error-handler');

gulp.task('styles', function () {
    return gulp.src(config.src + 'styles/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        sourceComments: 'map',
        imagePath: '../images'
    }))
    .on('error', error)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
        browsers: ['last 2 version']
    }))
    .pipe(cssimport())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
});
