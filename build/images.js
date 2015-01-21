'use strict';

var config      = require('./config.js');

var gulp        = require('gulp');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var browserSync = require('browser-sync');

gulp.task('images', function() {
    return gulp.src(imagesConfig.src)
        .pipe(changed(imagesConfig.dest))
        .pipe(imagemin())
        .pipe(gulp.dest(imagesConfig.dest))
        .pipe(browserSync.reload({ stream: true }));
});

var imagesConfig = {
    src: config.src + '/images/**',
    dest: config.dest + '/images/'
}
