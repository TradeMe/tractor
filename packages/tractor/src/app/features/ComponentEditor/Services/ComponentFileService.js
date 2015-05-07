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
    FileStructureService
) {
    var service = FileService($http, ComponentParserService, FileStructureService, 'components');
    service.getAll = getAll;
    return service;

    function getAll () {
        return this.getFileStructure()
        .then(function (fileStructure) {
            return fileStructure.allFiles.map(function (file) {
                return ComponentParserService.parse(file);
            });
        });
    }
};

ComponentEditor.service('ComponentFileService', ComponentFileService);
