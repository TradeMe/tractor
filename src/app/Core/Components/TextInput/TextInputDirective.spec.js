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
require('./TextInputDirective');

describe('TextInputDirective.js:', function() {
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
                compileDirective('<tractor-text-input></tractor-text-input>', scope);
            }).to.throw('The "tractor-text-input" directive requires a "model" attribute.');
        });

        it('should throw an error when `label` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-text-input model="model"></tractor-text-input>', scope);
            }).to.throw('The "tractor-text-input" directive requires a "label" attribute.');
        });

        it('should throw an error when `form` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-text-input model="model" label="Some label"></tractor-text-input>', scope);
            }).to.throw('The "tractor-text-input" directive requires a "form" attribute.');
        });

        it('should successfully compile the directive otherwise:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                var parentForm = {};
                scope.$parent.parent = parentForm;
                scope.model = {};
                compileDirective('<tractor-text-input model="model" label="Some label" form="parent"></tractor-text-input>', scope);
            }).not.to.throw();
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            var directive = compileDirective('<tractor-text-input model="model" label="Some Label" form="parent"></tractor-text-input>', scope);
            expect(directive.isolateScope().property).to.equal('someLabel');
        });

        it('should get the correct form off the parent scope:', function () {
            var scope = $rootScope.$new();
            var parentForm = {};
            scope.$parent.parent = parentForm;
            scope.model = {};
            var directive = compileDirective('<tractor-text-input model="model" label="Some Label" form="parent"></tractor-text-input>', scope);
            expect(directive.isolateScope().form).to.equal(parentForm);
        });

        it('should generate a unique id for the input:', function () {
            var scopeOne = $rootScope.$new();
            var scopeTwo = $rootScope.$new();
            var parentForm = {};
            scopeOne.$parent.parent = scopeTwo.$parent.parent = parentForm;
            scopeOne.model = scopeTwo.model = {};
            var directiveOne = compileDirective('<tractor-text-input model="model" label="Some label" form="parent"></tractor-text-input>', scopeOne);
            var directiveTwo = compileDirective('<tractor-text-input model="model" label="Some label" form="parent"></tractor-text-input>', scopeTwo);
            var idOne = directiveOne.isolateScope().id;
            var idTwo = directiveTwo.isolateScope().id;
            expect(idOne).not.to.be.undefined();
            expect(idTwo).not.to.be.undefined();
            expect(idOne).not.to.equal(idTwo);
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            var parentForm = {};
            scope.$parent.parent = parentForm;
            scope.model = {};
            var directive = compileDirective('<tractor-text-input model="model" label="Some label" form="parent"></tractor-text-input>', scope);
            expect(directive.isolateScope().property).to.equal('someLabel');
        });
    });
});
