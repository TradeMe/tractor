'use strict';

// Utilities:
var fs = require('fs');
var Promise = require('bluebird');

// Dependencies:
require('angular');
require('angular-sanitize');
require('angular-messages');
require('angular-mocks');
require('@uirouter/angularjs');
require('angular-sortable');
require('angular-local-storage');

var angular = window.angular;

require('./Core/Core');

require('./features/ControlPanel/ControlPanel');
require('./features/ControlPanel/ControlPanelController');
require('./features/Search/SearchController');

// Application Init:
var tractor = angular.module('tractor', [
    'ngMessages',
    'ui.router',
    'ui.sortable',
    'LocalStorageModule',
    'Core',
    'ControlPanel'
]);

tractor.config(function (
    $compileProvider,
    $stateProvider,
    $locationProvider,
    $urlMatcherFactoryProvider,
    $urlRouterProvider,
    localStorageServiceProvider
) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    localStorageServiceProvider.setPrefix('tractor');

    $urlMatcherFactoryProvider.type('TractorFile', {
        encode: function (toEncode) {
            return toEncode && toEncode.url ? toEncode.url.replace(/\s/g, '+') : '';
        },
        decode: function (toDecode) {
            return toDecode && typeof toDecode === 'string' ? { url: toDecode.replace(/\+/g, ' ') } : toDecode;
        },
        is: function (tractorFile) {
            return !tractorFile || tractorFile && tractorFile.url;
        },
        equals: function (a, b) {
            return a && a.url && b && b.url && a.url === b.url;
        }
    });

    var hrefAllowlist = $compileProvider.aHrefSanitizationWhitelist();
    // Add vscode:// to safe href list so we can open files in VSCODE
    $compileProvider.aHrefSanitizationWhitelist(new RegExp(hrefAllowlist.source.replace('):', '|vscode):')))

    $stateProvider
    .state('tractor', {
        url: '/',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ControlPanel/ControlPanel.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ControlPanelController as controlPanel'
    });

    $stateProvider
    .state('tractor.file', {
        url: '{file:TractorFile}',
        onEnter: function (redirectionService, $stateParams) {
            return redirectionService.goToFile($stateParams.file);
        }
    });
})
.run(function ($rootScope) {
    Promise.longStackTraces();
    Promise.setScheduler(function (cb) {
        $rootScope.$evalAsync(cb);
    });
});
