/*global beforeEach:true, inject: true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Testing:
require('./SelectInputDirective');

describe('SelectInputDirective.js:', function() {
    var $compile;
    var $rootScope;

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
                compileDirective('<tractor-select></tractor-select>', scope);
            }).to.throw('The "tractor-select" directive requires a "model" attribute.');
        });

        it('should throw an error when `label` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-select model="model"></tractor-select>', scope);
            }).to.throw('The "tractor-select" directive requires a "label" attribute.');
        });

        it('should throw an error when `options` is not passed in, and it can\'t determine the `options` by the `label`:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-select model="model" label="Some Label"></tractor-select>', scope);
            }).to.throw('The "tractor-select" directive requires an "options" attribute, or a "label" attribute that matches a set of options on the "model".');
        });

        it('should successfully compile the directive otherwise:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                scope.options = [];
                var directive = compileDirective('<tractor-select model="model" label="Some Label" options="options"></tractor-select>', scope);
            }).not.to.throw();
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            scope.options = [];
            var directive = compileDirective('<tractor-select model="model" label="Some Label" options="options"></tractor-select>', scope);
            expect(directive.isolateScope().property).to.equal('someLabel');
        });

        it('should first look for an "options" attribute to determine the `selectOptions`:', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            scope.options = [];
            var directive = compileDirective('<tractor-select model="model" label="Some Label" options="options"></tractor-select>', scope);
            expect(directive.isolateScope().selectOptions).to.equal(scope.options);
        });

        it('should should try to figure out the `selectOptions` from the "label" if an "options" attribute is not present:', function () {
            var scope = $rootScope.$new();
            scope.model = {
                options: []
            };
            var directive = compileDirective('<tractor-select model="model" label="Option"></tractor-select>', scope);
            expect(directive.isolateScope().selectOptions).to.equal(scope.model.options);
        });
    });
});
