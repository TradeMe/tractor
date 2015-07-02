/*global beforeEach:true, sinon: true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);

// Mocks:
var MockHttpResponseInterceptor = require('./HttpResponseInterceptor.mock');

// Testing:
require('./ConfigService');
var ConfigService;

describe('ConfigService.js:', function () {
    var $httpBackend;
    var httpResponseInterceptor;
    var persistentStateService;

    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.module(function ($provide, $httpProvider) {
            httpResponseInterceptor = new MockHttpResponseInterceptor();
            $provide.factory('httpResponseInterceptor', function () {
                return httpResponseInterceptor;
            });
            $httpProvider.interceptors.push('httpResponseInterceptor');
        });

        angular.mock.inject(function (_$httpBackend_, _ConfigService_) {
            $httpBackend = _$httpBackend_;
            ConfigService = _ConfigService_;
        });
    });

    describe('ConfigService.getConfig:', function () {
        it('should call the `/config` endpoint:', function (done) {
            var configMock = { };

            sinon.stub(httpResponseInterceptor, 'response').returns(configMock);

            $httpBackend.whenGET('/config').respond({ });

            ConfigService.getConfig()
            .then(function (config) {
                expect(config).to.equal(configMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });
});
