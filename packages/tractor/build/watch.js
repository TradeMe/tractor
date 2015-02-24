'use strict';

// Config:
var config = require('./config');

// Dependencies:
var gulp   = require('gulp');
var reload = require('./reload');

gulp.task('watch', ['reload'], function(callback) {
    gulp.watch(config.appDir + '/**/*', ['bundle']);
    gulp.watch(config.stylesDir + '/**/*', ['styles']);
    gulp.watch(config.imagesDir + '/**/*', ['images']);
    gulp.watch(config.src + 'index.html', ['markup']);
});
