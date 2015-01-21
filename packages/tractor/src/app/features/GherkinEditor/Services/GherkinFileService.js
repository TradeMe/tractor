'use strict';

// Module:
var GherkinEditor = require('../GherkinEditor');

var GherkinFileService = function GherkinFileService ($http) {
    return {
        openGherkinFile: openGherkinFile,
        saveGherkinFile: saveGherkinFile,
        getGherkinFileNames: getGherkinFileNames
    };

    function openGherkinFile (fileName) {
        return $http.get('/open-gherkin-file?name=' + encodeURIComponent(fileName));
    }

    function saveGherkinFile (name, gherkin) {
        gherkin = gherkin.replace(/"</g, '\'<').replace(/>"/g, '>\'');
        return $http.post('/save-gherkin-file', {
            name: name,
            gherkin: gherkin
        });
    }

    function getGherkinFileNames () {
        return $http.get('/get-gherkin-file-names');
    }
};

GherkinEditor.service('GherkinFileService', GherkinFileService);
