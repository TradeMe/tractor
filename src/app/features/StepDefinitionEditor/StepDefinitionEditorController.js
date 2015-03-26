'use strict';

// Module:
var StepDefinitionEditor = require('./StepDefinitionEditor');

// Dependencies:
require('./Services/StepDefinitionFileService');

var StepDefinitionEditorController = (function () {
    var StepDefinitionEditorController = function StepDefinitionEditorController (
        $scope,
        $window,
        NotifierService,
        StepDefinitionFileService,
        stepDefinitionFileStructure,
        stepDefinitionPath,
        components,
        mockData
    ) {
        this.$window = $window;
        this.$scope = $scope;
        this.notifierService = NotifierService;

        this.stepDefinitionFileService = StepDefinitionFileService;

        this.fileStructure = stepDefinitionFileStructure;
        this.availableComponents = components;
        this.availableMockData = mockData;

        if (stepDefinitionPath) {
            this.stepDefinition = this.stepDefinitionFileService.openStepDefinition(this.fileStructure, stepDefinitionPath.path, this.availableComponents, this.availableMockData);
        }

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
    };

    StepDefinitionEditorController.prototype.saveStepDefinitionFile = function () {
        this.stepDefinitionFileService.getStepDefinitionPath({
            name: this.stepDefinition.name,
            path: this.stepDefinition.path
        })
        .then(function (stepDefinitionPath) {
            var exists = this.stepDefinitionFileService.checkStepDefinitionExists(this.fileStructure, stepDefinitionPath.path);

            if (!exists || this.$window.confirm('This will overwrite "' + this.stepDefinition.name + '". Continue?')) {
                this.stepDefinitionFileService.saveStepDefinition({
                    ast: this.stepDefinition.ast,
                    name: this.stepDefinition.name,
                    path: stepDefinitionPath.path
                })
                .then(function () {
                    return this.stepDefinitionFileService.getStepDefinitionFileStructure();
                }.bind(this))
                .then(function (stepDefinitionFileStructure) {
                    this.fileStructure = stepDefinitionFileStructure;
                    this.stepDefinition = this.stepDefinitionFileService.openStepDefinition(this.fileStructure, stepDefinitionPath.path, this.availableComponents, this.availableMockData);
                }.bind(this));
            }
        }.bind(this));
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

    return StepDefinitionEditorController;
})();

StepDefinitionEditor.controller('StepDefinitionEditorController', StepDefinitionEditorController);
