/*global beforeEach:true, sinon: true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Mocks:
var MockNotifierService = require('../Components/Notifier/NotifierService.mock');

// Testing:
require('./HttpResponseInterceptor');
var HttpResponseInterceptor;

describe('ASTCreatorService.js:', function () {
    beforeEach(function () {
        angular.module('Notifier', []);
        angular.mock.module('Core');

        angular.mock.module(function ($provide) {
            $provide.factory('NotifierService', function () {
                return new MockNotifierService();
            });
        });

        angular.mock.inject(function (_HttpResponseInterceptor_) {
            HttpResponseInterceptor = _HttpResponseInterceptor_;
        });
    });

    describe('HttpResponseInterceptor.response:', function () {
        it('should return the `data` property off the `response` object:', function () {
            var originalResponse = {
                data: 'data',
                config: {
                    url: ''
                }
            };
            return HttpResponseInterceptor.response(originalResponse)
            .then(function (interceptedResponse) {
                expect(interceptedResponse).to.equal('data');
            });
        });

        it('should return the original `response` if the URL ends in ".html":', function () {
            var originalResponse = {
                data: 'data',
                config: {
                    url: '.html'
                }
            };
            return HttpResponseInterceptor.response(originalResponse)
            .then(function (interceptedResponse) {
                expect(interceptedResponse).to.equal(originalResponse);
            });
        });
    });

    describe('HttpResponseInterceptor.responseError:', function () {
        it('should pass any `error` property on the `response.data` to the `NotifierService`:', function () {
            sinon.stub(MockNotifierService.prototype, 'error');
            var originalResponse = {
                data: {
                    error: 'error'
                }
            };
            return HttpResponseInterceptor.responseError(originalResponse)
            .catch(function () {
                expect(MockNotifierService.prototype.error).to.have.been.calledWith('error');
            })
            .finally(function () {
                MockNotifierService.prototype.error.restore();
            });
        });
    });
});
