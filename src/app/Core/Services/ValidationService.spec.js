/*global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Test Utilities:
var chai = require('chai');
var sinon = require('sinon');

// Test setup:
var expect = chai.expect;

// Testing:
require('./ValidationService');
var validationService;

// Mocks:
var MockHttpResponseInterceptor = require('./HttpResponseInterceptor.mock');

describe('ValidationService.js:', function () {
    var $httpBackend;
    var httpResponseInterceptor;

    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.module(function ($provide, $httpProvider) {
            httpResponseInterceptor = new MockHttpResponseInterceptor();
            $provide.factory('httpResponseInterceptor', function () {
                return httpResponseInterceptor;
            });

            $httpProvider.interceptors.push('httpResponseInterceptor');
        });

        angular.mock.inject(function (_$httpBackend_, _validationService_) {
            $httpBackend = _$httpBackend_;
            validationService = _validationService_;
        });
    });

    describe('ValidationService.validateVariableName:', function () {
        it('should return the variable name if it is a valid variable name:', function () {
            expect(validationService.validateVariableName('variable')).to.equal('variable');
        });

        it('should return false if it is not a valid varible name:', function () {
            expect(validationService.validateVariableName('3')).to.equal(false);
        });
    });
});
