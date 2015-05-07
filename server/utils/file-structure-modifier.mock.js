'use strict';

// Errors:
var MockNotStubbedError = require('../Errors/MockNotStubbedError');

module.exports = {
    create: create
};

function create () {
    throw new MockNotStubbedError();
}
