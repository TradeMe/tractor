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
require('./features/ComponentEditor/Services/ComponentParserService');

require('./features/FeatureEditor/FeatureEditor');
require('./features/FeatureEditor/FeatureEditorController');
require('./features/FeatureEditor/Services/FeatureParserService');

require('./features/StepDefinitionEditor/StepDefinitionEditor');
require('./features/StepDefinitionEditor/StepDefinitionEditorController');
require('./features/StepDefinitionEditor/Services/StepDefinitionParserService');

require('./features/MockDataEditor/MockDataEditor');
require('./features/MockDataEditor/MockDataEditorController');
require('./features/MockDataEditor/Services/MockDataParserService');

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
            return toEncode && toEncode.url ? toEncode.url.replace(/\s/g, '+').replace(/^\//, '') : '';
        },
        decode: function (toDecode) {
            return toDecode && _.isString(toDecode) ? { url: toDecode.replace(/\+/g, ' ') } : toDecode;
        },
        is: function (tractorFile) {
            return !tractorFile || tractorFile && tractorFile.url;
        },
        equals: function (a, b) {
            return a && a.url && b && b.url && a.url === b.url;
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
            component: function ($stateParams, fileStructureService, ComponentParserService) {
                var componentUrl = $stateParams.file && $stateParams.file.url;
                if (!componentUrl) {
                    return null;
                }
                return fileStructureService.openItem(componentUrl)
                .then(function (file) {
                    return ComponentParserService.parse(file);
                });
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
            feature: function ($stateParams, fileStructureService, FeatureParserService) {
                var featureUrl = $stateParams.file && $stateParams.file.url;
                if (!featureUrl) {
                    return null;
                }
                return fileStructureService.openItem(featureUrl)
                .then(function (file) {
                    return FeatureParserService.parse(file);
                });
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
            mockData: function ($stateParams, fileStructureService, MockDataParserService) {
                var mockDataUrl = $stateParams.file && $stateParams.file.url;
                if (!mockDataUrl) {
                    return null;
                }
                return fileStructureService.openItem(mockDataUrl)
                .then(function (file) {
                    return MockDataParserService.parse(file);
                });
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
            availableComponents: function (fileStructureService) {
                return fileStructureService.getFileStructure()
                .then(function () {
                    return fileStructureService.fileStructure.allFiles
                    .filter(function (file) {
                        return file.url.endsWith('.component.js');
                    })
                    .map(function (component) {
                        return component.meta;
                    });
                });
            },
            availableMockData: function (fileStructureService) {
                return fileStructureService.getFileStructure()
                .then(function () {
                    return fileStructureService.fileStructure.allFiles
                    .filter(function (file) {
                        return file.url.endsWith('.mock.json');
                    })
                    .map(function (component) {
                        return component.meta;
                    });
                });
            },
            stepDefinition: function ($stateParams, availableComponents, availableMockData, fileStructureService, StepDefinitionParserService) {
                var stepDefinitionUrl = $stateParams.file && $stateParams.file.url;
                if (!stepDefinitionUrl) {
                    return null;
                }
                return fileStructureService.openItem(stepDefinitionUrl)
                .then(function (file) {
                    return StepDefinitionParserService.parse(file, availableComponents, availableMockData);
                });
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
