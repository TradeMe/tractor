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
    var STARTS_WITH_DOT = /^\./;
    var FILE_NAME = /(.*?)\./;

    return {
        openComponentFile: openComponentFile,
        saveComponentFile: saveComponentFile,
        getComponentFileStructure: getComponentFileStructure,
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

    function getComponentFileStructure () {
        return $http.get('/get-file-structure?directory=components');
    }

    function getAllComponents () {
        return this.getComponentFileStructure()
        .then(function (componentFileStructure) {
            debugger;
            var componentFileNames = getComponentNames(componentFileStructure);
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

    function getComponentNames (directory, names) {
        var skip = ['-name', '-path', '-type'];
        names = names || [];
        _.each(directory, function (item, name) {
            var type = item['-type'];
            if (type === 'd') {
                // Directory:
                getComponentNames(item, names);
            } else if (!_.contains(skip, name)) {
                // File:
                // Skip hidden files (starting with ".")...
                if (!STARTS_WITH_DOT.test(name)) {
                    names.push(_.last(FILE_NAME.exec(name)));
                }
            }
        });
        return names;
    }
};

ComponentEditor.service('ComponentFileService', ComponentFileService);
