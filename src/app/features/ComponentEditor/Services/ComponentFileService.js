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
        getComponentFileNames: getComponentFileNames,
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

    function getComponentFileNames () {
        return $http.get('/get-component-file-names');
    }

    function getAllComponents () {
        return this.getComponentFileNames()
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
