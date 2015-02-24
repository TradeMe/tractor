'use strict';

// Config:
var config      = require('./config.js');
var packageJSON = require('../package.json')

// Dependencies:
var gulp        = require('gulp');
var eslint      = require('gulp-eslint');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var ngAnnotate  = require('gulp-ng-annotate');
var browserSync = require('browser-sync');

// Errors:
var error = require('./utilities/error-handler');

gulp.task('bundle', function() {
    gulp.src(['src/**/*.js', 'server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());

    return browserify({
        entries: [config.appDir + 'app.js']
    })
    .transform('brfs')
    .bundle()
    .on('error', error)
    .pipe(source(packageJSON.name + '.bundle.js'))
    .pipe(buffer())
    .pipe(ngAnnotate({
        add: true,
        single_quotes: true
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
        stream: true
    }));
});
