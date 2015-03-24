'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('./StepDefinitionEditor');

// Dependencies:
require('./Services/StepDefinitionFileService');
require('./Services/StepDefinitionParserService');

var StepDefinitionEditorController = (function () {
    var StepDefinitionEditorController = function StepDefinitionEditorController (
        $stateParams,
        $scope,
        $window,
        NotifierService,
        StepDefinitionFileService,
        StepDefinitionParserService,
        stepDefinitionFileStructure,
        stepDefinitionFile,
        components,
        mockData
    ) {
        this.$window = $window;
        this.$scope = $scope;
        this.notifierService = NotifierService;

        this.stepDefinitionFileService = StepDefinitionFileService;
        this.stepDefinitionParserService = StepDefinitionParserService;

        this.fileStructure = stepDefinitionFileStructure;

        this.availableComponents = components;
        this.availableMockData = mockData;

        Object.defineProperties(this, {
            canAddComponents: {
                get: function () {
                    return this.availableComponents.length > 0
                        && this.stepDefinition.step.type !== 'Given';
                }
            },
            canAddMockData: {
                get: function () {
                    return this.availableMockData.length > 0
                        && this.stepDefinition.step.type === 'Given';
                }
            },
            hasComponents: {
                get: function () {
                    return this.stepDefinition
                        && this.stepDefinition.componentInstances
                        && this.stepDefinition.componentInstances.length > 0;
                }
            },
            hasMockData: {
                get: function () {
                    return this.stepDefinition
                        && this.stepDefinition.mockDataInstances
                        && this.stepDefinition.mockDataInstances.length > 0;
                }
            },
            showTasksSection: {
                get: function () {
                    return this.hasComponents
                        && this.stepDefinition.step.type === 'When';
                }
            },
            showExpectationsSection: {
                get: function () {
                    return this.hasComponents
                        && this.stepDefinition.step.type === 'Then';
                }
            },
            showMockDataSection: {
                get: function () {
                    return this.stepDefinition.step.type === 'Given';
                }
            }
        });

        if (stepDefinitionFile) {
            parseStepDefinitionFile.call(this, $stateParams.stepDefinition, stepDefinitionFile);
        }
    };

    StepDefinitionEditorController.prototype.saveStepDefinitionFile = function () {
        var ast = this.stepDefinition.ast;
        var name = this.stepDefinition.name;

        var exists = fileAlreadyExists(name, this.fileStructure);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.stepDefinitionFileService.saveStepDefinitionFile(ast, name)
            .then(function () {
                return this.stepDefinitionFileService.getStepDefinitionFileStructure();
            }.bind(this))
            .then(function (stepDefinitionFileStructure) {
                this.fileStructure = stepDefinitionFileStructure;
            }.bind(this));
        }
    };

    StepDefinitionEditorController.prototype.showErrors = function () {
        var stepDefinitionEditor = this.$scope['step-definition-editor'];
        if (stepDefinitionEditor.$invalid) {
            Object.keys(stepDefinitionEditor.$error).forEach(function (invalidType) {
                var errors = stepDefinitionEditor.$error[invalidType];
                errors.forEach(function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save step definition, something is invalid.');
            return false;
        } else {
            return true;
        }
    };

    function parseStepDefinitionFile (filename, stepDefinitionFile) {
        try {
            this.stepDefinition = this.stepDefinitionParserService.parse(stepDefinitionFile.ast, filename, this.availableComponents, this.availableMockData);
        } catch (e) { }
    }

    function fileAlreadyExists (fileName, directory) {
        return _.some(directory, function (info, name) {
            if (info['-type'] === 'd') {
                // Directory:
                return fileAlreadyExists(fileName, info);
            } else if (name !== '-type' && name !== '-path') {
                // File:
                return new RegExp(fileName + '\.').test(name);
            }
        });
    }

    return StepDefinitionEditorController;
})();

StepDefinitionEditor.controller('StepDefinitionEditorController', StepDefinitionEditorController);
