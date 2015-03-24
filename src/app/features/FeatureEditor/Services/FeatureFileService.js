'use strict';

// Module:
var FeatureEditor = require('../FeatureEditor');

var FeatureFileService = function FeatureFileService ($http) {
    return {
        openFeatureFile: openFeatureFile,
        saveFeatureFile: saveFeatureFile,
        getFeatureFileStructure: getFeatureFileStructure
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

    function getFeatureFileStructure () {
        return $http.get('/get-file-structure?directory=features');
    }
};

FeatureEditor.service('FeatureFileService', FeatureFileService);
