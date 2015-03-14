'use strict';

// Module:
var FeatureEditor = require('../FeatureEditor');

var FeatureFileService = function FeatureFileService ($http) {
    return {
        openFeatureFile: openFeatureFile,
        saveFeatureFile: saveFeatureFile,
        getFeatureFileNames: getFeatureFileNames
    };

    function openFeatureFile (fileName) {
        return $http.get('/open-feature-file?name=' + encodeURIComponent(fileName));
    }

    function saveFeatureFile (feature, name) {
        feature = feature.replace(/"</g, '\'<').replace(/>"/g, '>\'');
        return $http.post('/save-feature-file', {
            feature: feature,
            name: name
        });
    }

    function getFeatureFileNames () {
        return $http.get('/get-feature-file-names');
    }
};

FeatureEditor.service('FeatureFileService', FeatureFileService);
