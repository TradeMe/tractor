'use strict';

// Errors:
var MockNotStubbedError = require('../Errors/MockNotStubbedError');

module.exports = {
    generate: generate
};

function generate () {
    throw new MockNotStubbedError();
}
