'use strict';

var MockNotImplementedError = require('../../Errors/MockNotImplementedError');

var MockLocalStorageService = function MockLocalStorageService () {
};
MockLocalStorageService.prototype.get = function () {
    throw new MockNotImplementedError('`MockLocalStorageService.get` is not implemented.');
};
MockLocalStorageService.prototype.set = function () {
    throw new MockNotImplementedError('`MockLocalStorageService.set` is not implemented.');
};
MockLocalStorageService.prototype.remove = function () {
    throw new MockNotImplementedError('`MockLocalStorageService.remove` is not implemented.');
};

module.exports = MockLocalStorageService;
