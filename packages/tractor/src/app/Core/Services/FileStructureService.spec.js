/*global beforeEach:true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Utilities:
var Promise = require('bluebird');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Testing:
require('./FileStructureService');
var FileStructureService;

// Mocks:
var MockHttpResponseInterceptor = require('./HttpResponseInterceptor.mock');
var MockPersistentStateService = require('./PersistentStateService.mock');

describe('FileStructureService.js:', function () {
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
            persistentStateService = new MockPersistentStateService();
            $provide.factory('persistentStateService', function () {
                return persistentStateService;
            });

            $httpProvider.interceptors.push('httpResponseInterceptor');
        });

        angular.mock.inject(function (_$httpBackend_, _FileStructureService_) {
            $httpBackend = _$httpBackend_;
            FileStructureService = _FileStructureService_;
        });
    });

    describe('FileStructureService.getFileStructure:', function () {
        it('should get the current file structure from the server:', function (done) {
            var fileStructureMock = {
                directories: []
            };

            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructureMock);
            sinon.stub(persistentStateService, 'get').returns({ });

            $httpBackend.whenGET('/file-structure').respond({ });

            FileStructureService.getFileStructure()
            .then(function (fileStructure) {
                expect(fileStructure).to.equal(fileStructureMock);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });
});
