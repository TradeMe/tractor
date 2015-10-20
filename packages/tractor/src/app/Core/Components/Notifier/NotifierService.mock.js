'use strict';

var MockNotImplementedError = require('../../../Errors/MockNotImplementedError');

var MockNotifierService = function MockNotifierService () {
    this.notifications = [];
};
MockNotifierService.prototype.success = function () {
    throw new MockNotImplementedError('`NotifierService.success` is not implemented.');
};
MockNotifierService.prototype.info = function () {
    throw new MockNotImplementedError('`NotifierService.info` is not implemented.');
};
MockNotifierService.prototype.error = function () {
    throw new MockNotImplementedError('`NotifierService.error` is not implemented.');
};
MockNotifierService.prototype.dismiss = function () {
    throw new MockNotImplementedError('`NotifierService.dismiss` is not implemented.');
};

module.exports = MockNotifierService;
