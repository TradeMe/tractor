'use strict';

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies:
require('./FeatureParserService');

var FeatureFileService = function FeatureFileService (
    $http,
    FeatureParserService
) {
    return {
        openFeatureFile: openFeatureFile,
        saveFeatureFile: saveFeatureFile
    };

    function openFeatureFile (fileName) {
        return $http.get('/open-feature-file?name=' + encodeURIComponent(fileName))
        .then(function (featureFile) {
            return FeatureParserService.parse(featureFile.tokens);
        });
    }

    function saveFeatureFile (feature, name) {
        feature = feature.replace(/"</g, '\'<').replace(/>"/g, '>\'');
        return $http.post('/save-feature-file', {
            feature: feature,
            name: name
        });
    }
};

FeatureEditor.service('FeatureFileService', FeatureFileService);
