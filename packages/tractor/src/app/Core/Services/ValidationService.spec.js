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
        it('should send a varible name off to the server for validation:', function (done) {
            sinon.stub(httpResponseInterceptor, 'response').returns('variable');

            $httpBackend.whenGET('/variable-name-valid?variableName=variable').respond({});

            validationService.validateVariableName('variable')
            .then(function (variableName) {
                expect(variableName).to.equal('variable');
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });
});
