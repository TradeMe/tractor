/* global angular:true */

// Dependencies:
var visualRegression = require('./visual-regression/visual-regression.component');

var tractor = angular.module('tractor');
tractor.requires.push(visualRegression.name);

tractor.config(function (
    $stateProvider
) {
    'ngInject';

    $stateProvider
    .state('tractor.visual-regression', {
        url: 'visual-regression/',
        template: '<tractor-visual-regression></tractor-visual-regression>'
    });
});
