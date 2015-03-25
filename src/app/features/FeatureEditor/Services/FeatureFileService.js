'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies:
require('./FeatureParserService');
require('../../../Core/Services/FileStructureService');

var FeatureFileService = function FeatureFileService (
    $http,
    FeatureParserService,
    FileStructureService
) {
    return {
        checkFeatureExists: checkFeatureExists,
        getFeatureFileStructure: getFeatureFileStructure,
        getFeaturePath: getFeaturePath,
        openFeature: openFeature,
        saveFeature: saveFeature
    };

    function checkFeatureExists (featureFileStructure, featureFilePath) {
        return !!findFeatureByPath(featureFileStructure, featureFilePath);
    }

    function getFeatureFileStructure () {
        return FileStructureService.getFileStructure({
            directory: 'features',
            lex: true
        });
    }

    function getFeaturePath (options) {
        return $http.get('/get-feature-path', {
            params: options
        });
    }

    function openFeature (featureFileStructure, featureFilePath) {
        var featureFile = findFeatureByPath(featureFileStructure, featureFilePath);
        return featureFile ? FeatureParserService.parse(featureFile) : null;
    }

    function saveFeature (options) {
        options.feature = options.feature.replace(/"</g, '\'<').replace(/>"/g, '>\'');
        return $http.post('/save-feature-file', options);
    }

    function findFeatureByPath (featureFileStructure, featureFilePath) {
        return _.find(featureFileStructure.allFiles, function (featureFile) {
            return featureFile.path.includes(featureFilePath);
        });
    }
};

FeatureEditor.service('FeatureFileService', FeatureFileService);
