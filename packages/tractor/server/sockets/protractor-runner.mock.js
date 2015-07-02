'use strict';

var MockNotStubbedError = require('../errors/MockNotStubbedError');

module.exports = {
    run: run
};

function run () {
    throw new MockNotStubbedError();
}
