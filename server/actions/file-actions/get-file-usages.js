'use strict';

// Config:
var config = require('../../utils/get-config')();

// Dependencies:
var fileStructureUtils = require('../../utils/file-structure');

module.exports = getFileUsages;

function getFileUsages (request, response) {
    fileStructureUtils.getFileUsages(config.testDirectory)
    .then(function (fileStructure) {
        response.send(JSON.stringify(fileStructure.usages));
    });
}
