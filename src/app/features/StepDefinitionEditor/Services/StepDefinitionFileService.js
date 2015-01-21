'use strict';

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

var StepDefinitionFileService = function StepDefinitionFileService ($http) {
    return {
        openStepDefinitionFile: openStepDefinitionFile,
        saveStepDefinitionFile: saveStepDefinitionFile,
        getStepDefinitionFileNames: getStepDefinitionFileNames
    };

    function openStepDefinitionFile (fileName) {
        return $http.get('/open-step-definition-file?name=' + encodeURIComponent(fileName));
    }

    function saveStepDefinitionFile (program, name) {
        return $http.post('/save-step-definition-file', {
            program: program,
            name: name
        });
    }

    function getStepDefinitionFileNames () {
        return $http.get('/get-step-definition-file-names');
    }
};

StepDefinitionEditor.service('StepDefinitionFileService', StepDefinitionFileService);
