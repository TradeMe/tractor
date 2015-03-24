'use strict';

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

var StepDefinitionFileService = function StepDefinitionFileService ($http) {
    return {
        openStepDefinitionFile: openStepDefinitionFile,
        saveStepDefinitionFile: saveStepDefinitionFile,
        getStepDefinitionFileStructure: getStepDefinitionFileStructure
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

    function getStepDefinitionFileStructure () {
        return $http.get('/get-file-structure?directory=step_definitions');
    }
};

StepDefinitionEditor.service('StepDefinitionFileService', StepDefinitionFileService);
