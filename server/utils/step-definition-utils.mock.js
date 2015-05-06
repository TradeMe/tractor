'use strict';

// Errors:
var MockNotStubbedError = require('../Errors/MockNotStubbedError');

module.exports = {
    generateStepDefinitions: generateStepDefinitions
};

function generateStepDefinitions () {
    throw new MockNotStubbedError();
}
