'use strict';

var config      = require('./config.js');

var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var ngAnnotate  = require('gulp-ng-annotate');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var error = require('./utilities/error-handler');

gulp.task('bundle', function() {
    return browserify({
        entries: [config.appDir + 'app.js']
    })
    .transform('brfs')
    .bundle()
    .on('error', error)
    .pipe(source(getBundleName() + '.js'))
    .pipe(buffer())
    .pipe(ngAnnotate({
        add: true,
        single_quotes: true
    }))
    // .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({ stream: true }));
});

function getBundleName () {
    var app = require('../package.json');
    return app.name + '.' + 'min';
};
