/* global angular:true */

// Dependencies:
var visualRegression = require('./visual-regression/VisualRegression.component');

var tractor = angular.module('tractor');
tractor.requires.push(visualRegression.name);

tractor.config(function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    'ngInject';

    $urlMatcherFactoryProvider.type('TractorPath', {
        encode: function (toEncode) {
            return toEncode && toEncode.path ? toEncode.path.replace(/\s/g, '+') : '';
        },
        decode: function (toDecode) {
            return toDecode && typeof toDecode === 'string' ? { path: toDecode.replace(/\+/g, ' ') } : toDecode;
        },
        is: function (tractorPath) {
            return !tractorPath || tractorPath && tractorPath.path;
        },
        equals: function (a, b) {
            return a && a.path && b && b.path && a.path === b.path;
        }
    });

    $stateProvider
    .state('tractor.visual-regression', {
        url: 'visual-regression/{path:TractorPath}',
        template: '<tractor-visual-regression></tractor-visual-regression>'
    })
});
