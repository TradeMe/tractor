/*global beforeEach:true, describe:true, it:true */
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
var MockHttpResponseInterceptor = require('../../Services/HttpResponseInterceptor.mock');

// Testing:
require('./SubmitDirective');

describe('SubmitDirective.js:', function() {
    var $compile;
    var $rootScope;

    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.module(function ($provide) {
            $provide.factory('HttpResponseInterceptor', function () {
                return new MockHttpResponseInterceptor();
            });
        });

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    var compileDirective = function (template, scope) {
        var directive = $compile(template)(scope);
        scope.$digest();
        return directive;
    };

    describe('Link function:', function () {
        it('should throw an error when an `action` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                compileDirective('<tractor-submit></tractor-submit>', scope);
            }).to.throw('The "tractor-submit" directive requires an "action" attribute.');
        });

        it('should successfully compile the directive otherwise:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                compileDirective('<tractor-submit action="Some action"></tractor-submit>', scope);
            }).not.to.throw();
        });
    });
});
