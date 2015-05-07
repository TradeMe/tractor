/*global beforeEach:true, sinon: true, describe:true, it:true, expect:true */
'use strict';

// Utilities:
var Promise = require('bluebird');

// Mocks:
var MockHttpResponseInterceptor = require('./HttpResponseInterceptor.mock');

// Angular:
var angular = require('angular');
require('angular-mocks');

// Testing:
require('./ConfigService');
var $http;
var ConfigService;

describe('ConfigService.js:', function () {
    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.module(function ($provide) {
            $provide.factory('HttpResponseInterceptor', function () {
                return new MockHttpResponseInterceptor();
            });
        });

        angular.mock.inject(function (_$http_, _ConfigService_) {
            $http = _$http_;
            ConfigService = _ConfigService_;
        });
    });

    describe('ConfigService.getConfig:', function () {
        it('should call the `/config` endpoint:', function () {
            sinon.stub($http, 'get').returns(Promise.resolve());
            return ConfigService.getConfig()
            .then(function () {
                expect($http.get).to.have.been.calledWith('/config');
            });
        });
    });
});
