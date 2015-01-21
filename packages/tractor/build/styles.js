'use strict';

var config       = require('./config.js');

var gulp         = require('gulp');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssimport    = require('gulp-cssimport');
var browserSync  = require('browser-sync');

var error = require('./utilities/error-handler');

gulp.task('styles', function () {
  return gulp.src(sassConfig.src)
    .pipe(sourcemaps.init())
    .pipe(sass(sassConfig.settings))
    .on('error', error)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(cssimport())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({ stream: true }));
});

var sassConfig = {
    src: config.src + 'styles/style.scss',
    settings: {
        sourceComments: 'map',
        imagePath: '../images'
    }
}
