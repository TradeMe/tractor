/*global beforeEach:true, describe:true, it:true, expect:true */
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
require('./CheckboxDirective');

describe('CheckboxDirective.js:', function() {
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
        it('should throw an error when `model` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                compileDirective('<tractor-checkbox></tractor-checkbox>', scope);
            }).to.throw('The "tractor-checkbox" directive requires a "model" attribute.');
        });

        it('should throw an error when `label` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-checkbox model="model"></tractor-checkbox>', scope);
            }).to.throw('The "tractor-checkbox" directive requires an "label" attribute.');
        });

        it('should successfully compile the directive otherwise:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-checkbox model="model" label="Some property"></tractor-checkbox>', scope);
            }).not.to.throw();
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            var directive = compileDirective('<tractor-checkbox model="model" label="Some property"></tractor-checkbox>', scope);
            expect(directive.isolateScope().property).to.equal('someProperty');
        });
    });
});
