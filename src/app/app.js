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
  'Core',
  'Notifier',
  'ControlPanel',
  'ComponentEditor',
  'FeatureEditor',
  'StepDefinitionEditor',
  'MockDataEditor'
])
.config(function ($stateProvider, $urlRouterProvider) {
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
            componentFileNames: function (ComponentFileService) {
                return ComponentFileService.getComponentFileNames();
            },
            componentFile: function ($stateParams, ComponentFileService) {
                var component = $stateParams.component;
                return component ? ComponentFileService.openComponentFile(component) : null;
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
            featureFileNames: function (FeatureFileService) {
                return FeatureFileService.getFeatureFileNames();
            },
            featureFile: function ($stateParams, FeatureFileService) {
                var feature = $stateParams.feature;
                return feature ? FeatureFileService.openFeatureFile(feature) : null;
            }
        }
    })
    .state('tractor.step-definition-editor', {
        url: 'step-definition-editor?stepDefinition',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/StepDefinitionEditor/StepDefinitionEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'StepDefinitionEditorController as stepDefinitionEditor',
        resolve: {
            stepDefinitionFileNames: function (StepDefinitionFileService) {
                return StepDefinitionFileService.getStepDefinitionFileNames();
            },
            stepDefinitionFile: function ($stateParams, StepDefinitionFileService) {
                var stepDefinition = $stateParams.stepDefinition;
                return stepDefinition ? StepDefinitionFileService.openStepDefinitionFile(stepDefinition) : null;
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
        url: 'mock-data-editor?mockData',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/MockDataEditor/MockDataEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'MockDataEditorController as mockDataEditor',
        resolve: {
            mockDataFileNames: function (MockDataFileService) {
                return MockDataFileService.getMockDataFileNames();
            },
            mockDataFile: function ($stateParams, MockDataFileService) {
                var mockData = $stateParams.mockData;
                return mockData ? MockDataFileService.openMockDataFile(mockData) : null;
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
