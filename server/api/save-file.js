'use strict';

// Utilities:
var constants = require('../constants');
var os = require('os');
var path = require('path');

// Dependencies:
var fileStructureModifier = require('../utils/file-structure-modifier');
var fileStructureUtils = require('../utils/file-structure-utils/file-structure-utils');
var stepDefinitionUtils = require('../utils/step-definition-utils');

module.exports = init;

var saveData = {};
saveData[constants.COMPONENTS_DIR] = saveJSData;
saveData[constants.STEP_DEFINITIONS_DIR] = saveJSData;
saveData[constants.MOCK_DATA_DIR] = saveJSONData;
saveData[constants.FEATURES_DIR] = saveFeatureData;

function init () {
    return fileStructureModifier.create({
        preSave: saveFile,
        postSave: generateStepDefinitions
    });
}

function saveFile (fileStructure, request) {
    var type = request.params.type;
    var body = request.body;
    var directoryPath = path.dirname(body.path);
    var directory = fileStructureUtils.findDirectory(fileStructure, directoryPath);
    var extension = fileStructureUtils.getExtension(body.path);

    var file = {
        name: path.basename(body.path, extension)
    };
    saveData[type](file, body);

    directory.files.push(file);
    fileStructure.allFiles.push(file);

    return fileStructure;
}

function saveJSData (file, body) {
    file.ast = body.data;
}

function saveJSONData (file, body) {
    file.content = body.data;
}

function saveFeatureData (file, body) {
    var data = body.data.replace(constants.FEATURE_NEWLINE, os.EOL);
    file.content = data;
}

function generateStepDefinitions (fileStructure, request) {
    var type = request.params.type;

    if (type === constants.FEATURES_DIR) {
        return stepDefinitionUtils.generateStepDefinitions(fileStructure, request);
    } else {
        return fileStructure;
    }
}
