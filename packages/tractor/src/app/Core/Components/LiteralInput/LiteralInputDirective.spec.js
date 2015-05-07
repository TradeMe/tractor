/*global beforeEach:true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Mocks:
var MockHttpResponseInterceptor = require('../../Services/HttpResponseInterceptor.mock');

// Testing:
require('./LiteralInputDirective');

describe('LiteralInputDirective.js:', function() {
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
                compileDirective('<tractor-literal-input></tractor-literal-input>', scope);
            }).to.throw('The "tractor-literal-input" directive requires a "model" attribute.');
        });

        it('should throw an error when `name` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-literal-input model="model"></tractor-literal-input>', scope);
            }).to.throw('The "tractor-literal-input" directive requires a "name" attribute.');
        });

        it('should throw an error when `form` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                scope.name = '';
                compileDirective('<tractor-literal-input model="model" name="name"></tractor-literal-input>', scope);
            }).to.throw('The "tractor-literal-input" directive requires a "form" attribute.');
        });

        it('should successfully compile the directive otherwise:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                scope.name = '';
                compileDirective('<tractor-literal-input model="model" name="name" form="parent"></tractor-literal-input>', scope);
            }).not.to.throw();
        });

        it('should get the correct form off the parent scope:', function () {
            var scope = $rootScope.$new();
            var parentForm = {};
            scope.$parent.parent = parentForm;
            scope.model = {};
            scope.name = '';
            var directive = compileDirective('<tractor-literal-input model="model" name="name" form="parent"></tractor-literal-input>', scope);
            expect(directive.isolateScope().form).to.equal(parentForm);
        });

        it('should generate a unique id for the input:', function () {
            var scopeOne = $rootScope.$new();
            var scopeTwo = $rootScope.$new();
            scopeOne.model = scopeTwo.model = {};
            scopeOne.name = scopeTwo.name = '';
            var directiveOne = compileDirective('<tractor-literal-input model="model" name="name" form="parent"></tractor-literal-input>', scopeOne);
            var directiveTwo = compileDirective('<tractor-literal-input model="model" name="name" form="parent"></tractor-literal-input>', scopeTwo);
            expect(directiveOne.isolateScope().id).not.to.equal(directiveTwo.isolateScope().id);
        });
    });
});
