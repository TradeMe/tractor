'use strict';

var MockNotImplementedError = require('../../Errors/MockNotImplementedError');

var MockPersistentStateService = function MockPersistentStateService () {
};
MockPersistentStateService.prototype.get = function () {
    throw new MockNotImplementedError('`PersistentStateService.get` is not implemented.');
};
MockPersistentStateService.prototype.set = function () {
    throw new MockNotImplementedError('`PersistentStateService.set` is not implemented.');
};
MockPersistentStateService.prototype.remove = function () {
    throw new MockNotImplementedError('`PersistentStateService.remove` is not implemented.');
};

module.exports = MockPersistentStateService;
