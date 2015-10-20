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
require('./StepInputDirective');

describe('StepInputDirective.js:', function() {
    var $compile;
    var $rootScope;

    beforeEach(function () {
        angular.module('StepDefinitionEditor', []);
        angular.mock.module('Core');

        angular.mock.module(function ($provide) {
            $provide.factory('StepDeclarationModel', function () {
                return {};
            });
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
                compileDirective('<tractor-step-input></tractor-step-input>', scope);
            }).to.throw('The "tractor-step-input" directive requires a "model" attribute.');
        });

        it('should throw an error when `label` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-step-input model="model"></tractor-step-input>', scope);
            }).to.throw('The "tractor-step-input" directive requires a "label" attribute.');
        });

        it('should throw an error when `form` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-step-input model="model" label="Some label"></tractor-step-input>', scope);
            }).to.throw('The "tractor-step-input" directive requires a "form" attribute.');
        });

        it('should successfully compile the directive otherwise:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-step-input model="model" label="Some label" form="parent"></tractor-step-input>', scope);
            }).not.to.throw();
        });

        it('should get the correct form off the parent scope:', function () {
            var scope = $rootScope.$new();
            var parentForm = {};
            scope.$parent.parent = parentForm;
            scope.model = {};
            var directive = compileDirective('<tractor-step-input model="model" label="Some label" form="parent"></tractor-step-input>', scope);
            expect(directive.isolateScope().form).to.equal(parentForm);
        });

        it('should generate a unique id for the input:', function () {
            var scopeOne = $rootScope.$new();
            var scopeTwo = $rootScope.$new();
            scopeOne.model = scopeTwo.model = {};
            var directiveOne = compileDirective('<tractor-step-input model="model" label="Some label" form="parent"></tractor-step-input>', scopeOne);
            var directiveTwo = compileDirective('<tractor-step-input model="model" label="Some label" form="parent"></tractor-step-input>', scopeTwo);
            var idOne = directiveOne.isolateScope().id;
            var idTwo = directiveTwo.isolateScope().id;
            expect(idOne).not.to.be.undefined();
            expect(idTwo).not.to.be.undefined();
            expect(idOne).not.to.equal(idTwo);
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            var directive = compileDirective('<tractor-step-input model="model" label="Some label" form="parent"></tractor-step>', scope);
            expect(directive.isolateScope().property).to.equal('someLabel');
        });
    });
});
