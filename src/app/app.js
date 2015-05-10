'use strict';

// Utilities:
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
require('./Core/Services/ConfigService');
require('./Core/Services/FileStructureService');
require('./Core/Services/HttpResponseInterceptor');
require('./Core/Services/RealTimeService');

// Application Init:
angular.module('tractor', [
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
])
.config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('tractor');

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('tractor', {
        url: '/',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ControlPanel/ControlPanel.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ControlPanelController as controlPanel',
        resolve: {
            config: function (ConfigService) {
                return ConfigService.getConfig();
            }
        }
    })
    .state('tractor.component-editor', {
        url: 'component-editor/:component',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ComponentEditor/ComponentEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ComponentEditorController as componentEditor',
        resolve: {
            componentFileStructure: function (ComponentFileService) {
                return ComponentFileService.getFileStructure();
            },
            componentPath: function ($stateParams, ComponentFileService) {
                var componentName = $stateParams.component;
                return componentName ? ComponentFileService.getPath({ path: componentName }) : null;
            }
        }
    })
    .state('tractor.feature-editor', {
        url: 'feature-editor/:feature',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/FeatureEditor/FeatureEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'FeatureEditorController as featureEditor',
        resolve: {
            featureFileStructure: function (FeatureFileService) {
                return FeatureFileService.getFileStructure();
            },
            featurePath: function ($stateParams, FeatureFileService) {
                var feature = $stateParams.feature;
                return feature ? FeatureFileService.getPath({ path: feature }) : null;
            }
        }
    })
    .state('tractor.step-definition-editor', {
        url: 'step-definition-editor/:stepDefinition',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/StepDefinitionEditor/StepDefinitionEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'StepDefinitionEditorController as stepDefinitionEditor',
        resolve: {
            stepDefinitionFileStructure: function (StepDefinitionFileService) {
                return StepDefinitionFileService.getFileStructure();
            },
            stepDefinitionPath: function ($stateParams, StepDefinitionFileService) {
                var stepDefinition = $stateParams.stepDefinition;
                return stepDefinition ? StepDefinitionFileService.getPath({ path: stepDefinition }) : null;
            },
            components: function (ComponentFileService) {
                return ComponentFileService.getAll();
            },
            mockData: function (MockDataFileService) {
                return MockDataFileService.getAll();
            }
        }
    })
    .state('tractor.mock-data-editor', {
        url: 'mock-data-editor/:mockData',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/MockDataEditor/MockDataEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'MockDataEditorController as mockDataEditor',
        resolve: {
            mockDataFileStructure: function (MockDataFileService) {
                return MockDataFileService.getFileStructure();
            },
            mockDataPath: function ($stateParams, MockDataFileService) {
                var mockDataName = $stateParams.mockData;
                return mockDataName ? MockDataFileService.getPath({ path: mockDataName }) : null;
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
