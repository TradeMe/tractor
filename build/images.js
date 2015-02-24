'use strict';

// Config:
var config       = require('./config.js');

// Dependencies:
var gulp        = require('gulp');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var browserSync = require('browser-sync');

gulp.task('images', function() {
    return gulp.src(config.src + '/images/*')
    .pipe(changed(config.dest + '/images/'))
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest + '/images/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});
