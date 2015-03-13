'use strict';

// Config:
var config = require('./config');

// Utilities:
var gulp = require('gulp');

module.exports = watch;

function watch (callback) {
    gulp.watch(config.appDir + '/**/*', ['test']);
    gulp.watch(config.stylesDir + '/**/*', ['styles']);
    gulp.watch(config.imagesDir + '/**/*', ['images']);
    gulp.watch(config.src + 'index.html', ['markup']);
}
