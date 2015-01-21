'use strict';

var config      = require('./config.js');

var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('fonts', function() {
    return gulp.src(config.src + 'fonts/*')
    .pipe(gulp.dest(config.dest + 'fonts/'));
});
