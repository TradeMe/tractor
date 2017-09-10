'use strict';

// Dependencies:
var gulp = require('gulp');

// Tasks:
var fonts = require('./build/fonts');
var images = require('./build/images');
var lint = require('./build/lint');
var js = require('./build/js');
var markup = require('./build/markup');
var reload = require('./build/reload');
var styles = require('./build/styles');
var test = require('./build/test');
var watch = require('./build/watch');

gulp.task('fonts', fonts);

gulp.task('images', images);

gulp.task('markup', markup);

gulp.task('styles', styles);

gulp.task('init', js.init);
gulp.task('bundle', js.bundle);
gulp.task('lint', ['bundle'], lint);
gulp.task('test', ['lint'], test);

gulp.task('reload', reload);
gulp.task('watch', ['reload'], watch);

gulp.task('default', ['fonts', 'images', 'markup', 'styles', 'watch', 'init']);
gulp.task('build', ['fonts', 'images', 'markup', 'styles', 'init']);
