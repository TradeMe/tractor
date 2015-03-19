'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('./ComponentParserService');

var ComponentFileService = function ComponentFileService (
    $http,
    ComponentParserService
) {
    return {
        openComponentFile: openComponentFile,
        saveComponentFile: saveComponentFile,
        getComponentFolderStructure: getComponentFolderStructure,
        getAllComponents: getAllComponents
    };

    function openComponentFile (file) {
        return $http.get('/open-component-file?name=' + encodeURIComponent(file));
    }

    function saveComponentFile (program, name) {
        return $http.post('/save-component-file', {
            program: program,
            name: name
        });
    }

    function getComponentFolderStructure () {
        return $http.get('/get-component-folder-structure');
    }

    function getAllComponents () {
        return this.getComponentFolderStructure()
        .then(function (componentFileNames) {
            var openComponentFiles = _.map(componentFileNames, function (componentFileName) {
                return openComponentFile(componentFileName);
            });
            return Promise.all(openComponentFiles)
            .then(function (results) {
                return _.map(results, function (result) {
                    return ComponentParserService.parse(result.ast);
                });
            });
        });
    }
};

ComponentEditor.service('ComponentFileService', ComponentFileService);
