'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('./StepDefinitionParserService');
require('../../../Core/Services/FileStructureService');

var StepDefinitionFileService = function StepDefinitionFileService (
    $http,
    StepDefinitionParserService,
    FileStructureService
) {
    return {
        checkStepDefinitionExists: checkStepDefinitionExists,
        getStepDefinitionFileStructure: getStepDefinitionFileStructure,
        getStepDefinitionPath: getStepDefinitionPath,
        openStepDefinition: openStepDefinition,
        saveStepDefinition: saveStepDefinition
    };

    function checkStepDefinitionExists (stepDefinitionFileStructure, stepDefinitionFilePath) {
        return !!findStepDefinitionByPath(stepDefinitionFileStructure, stepDefinitionFilePath);
    }

    function getStepDefinitionFileStructure () {
        return FileStructureService.getFileStructure()
        .then(function (fileStructure) {
            return _.find(fileStructure.directories, function (directory) {
                return directory.name === 'step_definitions';
            });
        });
    }

    function getStepDefinitionPath (options) {
        return $http.get('/get-step-definition-path', {
            params: options
        });
    }

    function openStepDefinition (stepDefinitionFileStructure, stepDefinitionFilePath, components, mockData) {
        var stepDefinitionFile = findStepDefinitionByPath(stepDefinitionFileStructure, stepDefinitionFilePath);
        return stepDefinitionFile ? StepDefinitionParserService.parse(stepDefinitionFile, components, mockData) : null;
    }

    function saveStepDefinition (options) {
        return $http.post('/save-step-definition-file', options);
    }

    function findStepDefinitionByPath (stepDefinitionFileStructure, stepDefinitionFilePath) {
        return _.find(stepDefinitionFileStructure.allFiles, function (stepDefinitionFile) {
            return stepDefinitionFile.path.includes(stepDefinitionFilePath);
        });
    }
};

StepDefinitionEditor.service('StepDefinitionFileService', StepDefinitionFileService);
