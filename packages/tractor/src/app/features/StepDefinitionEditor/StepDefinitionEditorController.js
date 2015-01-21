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
        StepDefinitionFileService,
        StepDefinitionParserService,
        stepDefinitionFileNames,
        components
    ) {
        this.stepDefinitionFileService = StepDefinitionFileService;
        this.stepDefinitionParserService = StepDefinitionParserService;

        this.stepDefinitionFileNames = stepDefinitionFileNames;
        this.availableComponents = components;
    };

    StepDefinitionEditorController.prototype.openStepDefinitionFile = function (filename) {
        this.stepDefinitionFileService.openStepDefinitionFile(filename)
        .then(_.bind(function (data) {
            try {
                this.stepDefinition = this.stepDefinitionParserService.parse(data.ast, filename, this.availableComponents);
            } catch (e) { }
        }, this));
    };

    StepDefinitionEditorController.prototype.saveStepDefinitionFile = function () {
        this.stepDefinitionFileService.saveStepDefinitionFile(this.stepDefinition.ast, this.stepDefinition.name);
    };

    return StepDefinitionEditorController;
})();

StepDefinitionEditor.controller('StepDefinitionEditorController', StepDefinitionEditorController);
