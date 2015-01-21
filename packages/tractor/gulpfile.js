'use strict';

var gulp = require('gulp');

var bundle = require('./build/bundle');
var styles = require('./build/styles');
var markup = require('./build/markup');
var images = require('./build/images');
var fonts = require('./build/fonts');
var watch = require('./build/watch');

gulp.task('default', ['bundle', 'styles', 'markup', 'images', 'fonts', 'watch']);
