'use strict';

// Errors:
var MockNotStubbedError = require('../../Errors/MockNotStubbedError');

module.exports = {
    getFileStructure: getFileStructure,
    saveFileStructure: saveFileStructure,
    findDirectory: findDirectory,
    findFile: findFile,
    getExtension: getExtension
};

function getFileStructure () {
    throw new MockNotStubbedError();
}

function saveFileStructure () {
    throw new MockNotStubbedError();
}

function findDirectory () {
    throw new MockNotStubbedError();
}

function findFile () {
    throw new MockNotStubbedError();
}

function getExtension () {
    throw new MockNotStubbedError();
}
