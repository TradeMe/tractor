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

require('./features/GherkinEditor/GherkinEditor');
require('./features/GherkinEditor/GherkinEditorController');
require('./features/GherkinEditor/Services/GherkinFileService');

require('./features/StepDefinitionEditor/Services/StepDefinitionFileService');
require('./features/StepDefinitionEditor/StepDefinitionEditorController');

require('./features/MockDataEditor/Services/MockDataFileService');
require('./features/MockDataEditor/MockDataEditorController');

require('./Core/Core');
require('./Core/Services/ConfigService');
require('./Core/Services/ErrorInterceptor');
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
  'GherkinEditor',
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
        url: 'component-editor',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/ComponentEditor/ComponentEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'ComponentEditorController as componentEditor',
        resolve: {
            componentFileNames: function (ComponentFileService) {
                return ComponentFileService.getComponentFileNames();
            }
        }
    })
    .state('tractor.gherkin-editor', {
        url: 'gherkin-editor',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/GherkinEditor/GherkinEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'GherkinEditorController as gherkinEditor',
        resolve: {
            gherkinFileNames: function (GherkinFileService) {
                return GherkinFileService.getGherkinFileNames();
            }
        }
    })
    .state('tractor.step-definition-editor', {
        url: 'step-definition-editor',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/StepDefinitionEditor/StepDefinitionEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'StepDefinitionEditorController as stepDefinitionEditor',
        resolve: {
            stepDefinitionFileNames: function (StepDefinitionFileService) {
                return StepDefinitionFileService.getStepDefinitionFileNames();
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
        url: 'mock-data-editor',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/features/MockDataEditor/MockDataEditor.html', 'utf8'),
        /* eslint-enable no-path-concat */
        controller: 'MockDataEditorController as mockDataEditor',
        resolve: {
            mockDataFileNames: function (MockDataFileService) {
                return MockDataFileService.getMockDataFileNames();
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
