'use strict';

var config      = require('./config.js');

var gulp        = require('gulp');
var browserSync = require('browser-sync');

gulp.task('reload', function() {
    browserSync(browserSyncConfig);
});

var browserSyncConfig = {
    proxy: 'localhost:4000'
};
