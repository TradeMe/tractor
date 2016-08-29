'use strict';

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
var FileService = require('../../../Core/Services/FileService');
require('./ComponentParserService');
require('../../../Core/Services/FileStructureService');

var ComponentFileService = function ComponentFileService (
    $http,
    ComponentParserService,
    fileStructureService
) {
    return FileService($http, ComponentParserService, fileStructureService, 'components');
};

ComponentEditor.service('ComponentFileService', ComponentFileService);
