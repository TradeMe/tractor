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
    fileStructureService
) {
    return FileService($http, StepDefinitionParserService, fileStructureService, 'step-definitions');
};

StepDefinitionEditor.service('StepDefinitionFileService', StepDefinitionFileService);
