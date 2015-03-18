'use strict';

var MockNotImplementedError = require('../Errors/MockNotImplementedError');

var MockHttpResponseInterceptor = function MockHttpResponseInterceptor () {
};
MockHttpResponseInterceptor.prototype.response = function () {
    throw new MockNotImplementedError('`HttpResponseInterceptor.response` is not implemented.');
};
MockHttpResponseInterceptor.prototype.responseError = function () {
    throw new MockNotImplementedError('`HttpResponseInterceptor.responseError` is not implemented.');
};

module.exports = MockHttpResponseInterceptor;
