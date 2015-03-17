'use strict';

// Config:
var config = require('./config');

// Utilities:
var gulp = require('gulp');

module.exports = watch;

function watch (reportTaskDone) {
    gulp.watch(config.serverDir + '/**/*', ['test-server']);
    gulp.watch(config.stylesDir + '/**/*', ['styles']);
    gulp.watch(config.imagesDir + '/**/*', ['images']);
    gulp.watch(config.src + 'index.html', ['markup']);
    reportTaskDone();
}
