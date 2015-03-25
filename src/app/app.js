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
require('./Core/Services/HttpResponseInterceptor');
require('./Core/Services/RealTimeService');

require('./features/Notifier/Notifier');

// Application Init:
angular.module('tractor', [
  'ngMessages',
  'ui.router',
  'ui.sortable',
  'LocalStorageModule',
  'Core',
  'Notifier',
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
        controller: 'ControlPanelController as controlPanel'
    })
    .state('tractor.component-editor', {
        url: 'component-editor?component',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ComponentEditor/ComponentEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ComponentEditorController as componentEditor',
        resolve: {
            componentFileStructure: function (ComponentFileService) {
                return ComponentFileService.getComponentFileStructure();
            },
            componentPath: function ($stateParams, ComponentFileService) {
                var componentName = $stateParams.component;
                return componentName ? ComponentFileService.getComponentPath({ name: componentName }) : null;
            }
        }
    })
    .state('tractor.feature-editor', {
        url: 'feature-editor?feature',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/FeatureEditor/FeatureEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'FeatureEditorController as featureEditor',
        resolve: {
            featureFileStructure: function (FeatureFileService) {
                return FeatureFileService.getFeatureFileStructure();
            },
            featurePath: function ($stateParams, FeatureFileService) {
                var feature = $stateParams.feature;
                return feature ? FeatureFileService.getFeaturePath({ name: feature }) : null;
            }
        }
    })
    .state('tractor.step-definition-editor', {
        url: 'step-definition-editor?step-definition',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/StepDefinitionEditor/StepDefinitionEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'StepDefinitionEditorController as stepDefinitionEditor',
        resolve: {
            stepDefinitionFileStructure: function (StepDefinitionFileService) {
                return StepDefinitionFileService.getStepDefinitionFileStructure();
            },
            stepDefinitionPath: function ($stateParams, StepDefinitionFileService) {
                var stepDefinition = $stateParams['step-definition'];
                return stepDefinition ? StepDefinitionFileService.getStepDefinitionPath({ name: stepDefinition }) : null;
            },
            components: function (ComponentFileService) {
                return ComponentFileService.getAllComponents();
            },
            mockData: function (MockDataFileService) {
                return MockDataFileService.getAllMockData();
            }
        }
    })
    .state('tractor.mock-data-editor', {
        url: 'mock-data-editor?mock-data',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/MockDataEditor/MockDataEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'MockDataEditorController as mockDataEditor',
        resolve: {
            mockDataFileStructure: function (MockDataFileService) {
                return MockDataFileService.getMockDataFileStructure();
            },
            mockDataPath: function ($stateParams, MockDataFileService) {
                var mockDataName = $stateParams['mock-data'];
                return mockDataName ? MockDataFileService.getMockDataPath({ name: mockDataName }) : null;
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
