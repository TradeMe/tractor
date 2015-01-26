'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Testing:
var LiteralInputDirective;

describe('LiteralInputDirective.js:', function() {
    var $compile;
    var $rootScope;

    beforeEach(function () {
        LiteralInputDirective = require('./LiteralInputDirective');
    });

    beforeEach(angular.mock.module('Core'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    var compileDirective = function (template, scope) {
        var directive = $compile(template)(scope);
        scope.$digest();
        return directive;
    };

    describe('Link function:', function () {
        it('should throw an error when `model` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                var directive = compileDirective('<tractor-literal-input></tractor-literal-input>', scope);
            }).to.throw('The "tractor-literal-input" directive requires an "model" attribute.');
        });

        it('should throw an error when `name` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                var directive = compileDirective('<tractor-literal-input model="model"></tractor-literal-input>', scope);
            }).to.throw('The "tractor-literal-input" directive requires a "name" attribute.');
        });
    });

    describe('Blur handler:', function () {
        it('should set `model` to `null` if `optional` is `false`:', function () {
            var scope = $rootScope.$new();
            scope.model = '';
            scope.name = 'Some name';
            scope.optional = false;
            var directive = compileDirective('<tractor-literal-input model="model" name="name" optional="optional"></tractor-literal-input>', scope);

            var isolateScope = directive.isolateScope();
            isolateScope.blur();

            expect(isolateScope.model).to.equal('null');
        });

        it('should leave the `model` as is if `optional` is `true`:', function () {
            var scope = $rootScope.$new();
            scope.model = '';
            scope.name = 'Some name';
            scope.optional = true;
            var directive = compileDirective('<tractor-literal-input model="model" name="name" optional="optional"></tractor-literal-input>', scope);

            var isolateScope = directive.isolateScope();
            isolateScope.blur();

            expect(isolateScope.model).to.equal(scope.model);
        });
    });
});
