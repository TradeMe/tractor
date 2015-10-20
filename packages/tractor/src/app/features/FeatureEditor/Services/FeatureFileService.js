'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies:
var FileService = require('../../../Core/Services/FileService');
require('./FeatureParserService');
require('../../../Core/Services/FileStructureService');

var FeatureFileService = function FeatureFileService (
    $http,
    FeatureParserService,
    fileStructureService
) {
    var service = FileService($http, FeatureParserService, fileStructureService, 'features');
    var save = service.saveFile;
    service.saveFile = _.compose(save, fixFeatureParameters);
    return service;

    function fixFeatureParameters (options) {
        options.data = options.data.replace(/"</g, '\'<').replace(/>"/g, '>\'');
        return options;
    }
};

FeatureEditor.service('FeatureFileService', FeatureFileService);
