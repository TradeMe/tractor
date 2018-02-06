'use strict';

// Utilities:
var gulp = require('gulp');

module.exports = watch;

function watch (reportTaskDone) {
    gulp.watch('./src/app/**/*', ['lint']);
    gulp.watch('./src/styles/**/*', ['styles']);
    gulp.watch('./src/images/**/*', ['images']);
    gulp.watch('./src/index.html', ['markup']);
    reportTaskDone();
}
