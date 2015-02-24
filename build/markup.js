'use strict';

// Config:
var config      = require('./config.js');

// Dependencies:
var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('markup', function() {
    return gulp.src(config.src + '*.html')
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
});
