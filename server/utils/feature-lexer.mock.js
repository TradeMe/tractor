'use strict';

// Errors:
var MockNotStubbedError = require('../errors/MockNotStubbedError');

module.exports = {
    lex: lex
};

function lex () {
    throw new MockNotStubbedError();
}
