/*global beforeEach:true, inject: true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Testing:
require('./StepInputDirective');

describe('StepInputDirective.js:', function() {
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
                scope.label = ''
                compileDirective('<tractor-step-input model="model" label="label"></tractor-step-input>', scope);
            }).to.throw('The "tractor-step-input" directive requires a "form" attribute.');
        });

        it('should get the correct form off the parent scope:', function () {
            var scope = $rootScope.$new();
            var parentForm = {};
            scope.$parent.parent = parentForm;
            scope.model = {};
            scope.name = '';
            var directive = compileDirective('<tractor-step-input model="model" name="name" form="parent"></tractor-step-input>', scope);
            expect(directive.isolateScope().form).to.equal(parentForm);
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            var parentForm = {};
            scope.$parent.parent = parentForm;
            scope.model = {};
            scope.options = [];
            var directive = compileDirective('<tractor-step-input model="model" label="Some Label" form="parent"></tractor-step>', scope);
            expect(directive.isolateScope().property).to.equal('someLabel');
        });
    });
});
