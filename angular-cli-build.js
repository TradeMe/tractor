/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');
var moduleImporter = require('node-sass-module-importer');

module.exports = function(defaults) {
    return new Angular2App(defaults, {
        vendorNpmFiles: [
            'systemjs/dist/system-polyfills.js',
            'systemjs/dist/system.src.js',
            'zone.js/dist/**/*.+(js|js.map)',
            'es6-shim/es6-shim.js',
            'reflect-metadata/**/*.+(ts|js|js.map)',
            'rxjs/**/*.+(js|js.map)',
            '@angular/**/*.+(js|js.map)',
            'angular-2-local-storage/dist/*',
            'assert/**/*',
            'base64-js/**/*',
            'buffer/**/*',
            'buffer-shims/**/*',
            'camel-case/**/*',
            'dedent/**/*',
            'escodegen/**/*',
            'esprima/**/*',
            'estemplate/**/*',
            'estraverse/**/*',
            'esutils/**/*',
            'ieee754/**/*',
            'inherits/**/*',
            'isarray/**/*',
            'lodash.isregexp/**/*',
            'lower-case/**/*',
            'pascal-case/**/*',
            'path-browserify/**/*',
            'sentence-case/**/*',
            'socket.io-client/**/*',
            'systemjs-plugin-json/**/*',
            'source-map/**/*',
            'title-case/**/*',
            'upper-case/**/*',
            'upper-case-first/**/*',
            'util/**/*'
        ],
        sassCompiler: {
            importer: moduleImporter
        }
    });
};
