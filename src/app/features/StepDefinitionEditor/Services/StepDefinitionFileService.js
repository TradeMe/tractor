'use strict';

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
var FileService = require('../../../Core/Services/FileService');
require('./StepDefinitionParserService');
require('../../../Core/Services/FileStructureService');

var StepDefinitionFileService = function StepDefinitionFileService (
    $http,
    StepDefinitionParserService,
    FileStructureService
) {
    return FileService($http, StepDefinitionParserService, FileStructureService, 'step_definitions');
};

StepDefinitionEditor.service('StepDefinitionFileService', StepDefinitionFileService);
