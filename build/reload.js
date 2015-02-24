'use strict';

// Config:
var config       = require('./config.js');

// Dependencies:
var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('reload', function() {
    browserSync({
        proxy: 'localhost:4000'
    });
});
