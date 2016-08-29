'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');
var Promise = require('bluebird');

// Dependencies:
var angular = require('angular');
require('angular-sanitize');
require('angular-messages');
require('angular-mocks');
require('angular-ui-router');
require('angular-sortable');
require('angular-local-storage');

require('./features/ControlPanel/ControlPanel');
require('./features/ControlPanel/ControlPanelController');

require('./features/ComponentEditor/ComponentEditor');
require('./features/ComponentEditor/ComponentEditorController');
require('./features/ComponentEditor/Services/ComponentFileService');

require('./features/FeatureEditor/FeatureEditor');
require('./features/FeatureEditor/FeatureEditorController');
require('./features/FeatureEditor/Services/FeatureFileService');

require('./features/StepDefinitionEditor/Services/StepDefinitionFileService');
require('./features/StepDefinitionEditor/StepDefinitionEditorController');

require('./features/MockDataEditor/Services/MockDataFileService');
require('./features/MockDataEditor/MockDataEditorController');

require('./Core/Core');
require('./Core/Services/FileStructureService');
require('./Core/Services/HttpResponseInterceptor');
require('./Core/Services/RealTimeService');

// Application Init:
var tractor = angular.module('tractor', [
    'ngMessages',
    'ui.router',
    'ui.sortable',
    'LocalStorageModule',
    'Core',
    'ControlPanel',
    'ComponentEditor',
    'FeatureEditor',
    'StepDefinitionEditor',
    'MockDataEditor'
]);

tractor.config(function (
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
            return toEncode && toEncode.name ? toEncode.name.replace(/\s/g, '+') : '';
        },
        decode: function (toDecode) {
            return toDecode && _.isString(toDecode) ? { name: toDecode.replace(/\+/g, ' ') } : toDecode;
        },
        is: function (tractorFile) {
            return !tractorFile || tractorFile && tractorFile.name;
        },
        equals: function (a, b) {
            return a && a.name && b && b.name && a.name === b.name;
        }
    });

    $stateProvider
    .state('tractor', {
        url: '/',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ControlPanel/ControlPanel.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ControlPanelController as controlPanel'
    })
    .state('tractor.components', {
        url: 'components/{file:TractorFile}',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ComponentEditor/ComponentEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ComponentEditorController as componentEditor',
        resolve: {
            componentFileStructure: function (ComponentFileService) {
                return ComponentFileService.getFileStructure();
            },
            componentPath: function ($stateParams, ComponentFileService) {
                var componentName = $stateParams.file && $stateParams.file.name;
                return componentName ? ComponentFileService.getPath({ name: componentName }) : null;
            }
        }
    })
    .state('tractor.features', {
        url: 'features/{file:TractorFile}',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/FeatureEditor/FeatureEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'FeatureEditorController as featureEditor',
        resolve: {
            featureFileStructure: function (FeatureFileService) {
                return FeatureFileService.getFileStructure();
            },
            featurePath: function ($stateParams, FeatureFileService) {
                var featureName = $stateParams.file && $stateParams.file.name;
                return featureName ? FeatureFileService.getPath({ name: featureName }) : null;
            }
        }
    })
    .state('tractor.mock-data', {
        url: 'mock-data/{file:TractorFile}',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/MockDataEditor/MockDataEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'MockDataEditorController as mockDataEditor',
        resolve: {
            mockDataFileStructure: function (MockDataFileService) {
                return MockDataFileService.getFileStructure();
            },
            mockDataPath: function ($stateParams, MockDataFileService) {
                var mockDataName = $stateParams.file && $stateParams.file.name;
                return mockDataName ? MockDataFileService.getPath({ name: mockDataName }) : null;
            }
        }
    })
    .state('tractor.step-definitions', {
        url: 'step-definitions/{file:TractorFile}',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/StepDefinitionEditor/StepDefinitionEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'StepDefinitionEditorController as stepDefinitionEditor',
        resolve: {
            stepDefinitionFileStructure: function (StepDefinitionFileService) {
                return StepDefinitionFileService.getFileStructure();
            },
            stepDefinitionPath: function ($stateParams, StepDefinitionFileService) {
                var stepDefinitionName = $stateParams.file && $stateParams.file.name;
                return stepDefinitionName ? StepDefinitionFileService.getPath({ name: stepDefinitionName }) : null;
            }
        }
    });
})
.run(function ($rootScope) {
    Promise.longStackTraces();
    Promise.setScheduler(function (cb) {
        $rootScope.$evalAsync(cb);
    });
});

var $http = angular.injector(['ng']).get('$http');
Promise.all([$http.get('/config'), $http.get('/plugins')])
.spread(function (config, plugins) {
    tractor.constant('config', config.data);
    tractor.constant('plugins', plugins.data);
    angular.bootstrap(document.body, ['tractor'], {
        strictDi: true
    });
});
