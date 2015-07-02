/*global describe:true, beforeEach:true, it:true, expect:true */
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

// Testing:
require('./DragFileDirective');

describe('DragFileDirective.js:', function() {
    var $compile;
    var $rootScope;

    beforeEach(function () {
        angular.mock.module('Core');

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
        it('should add the "draggable" attribute to the element:', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            var directive = compileDirective('<div tractor-drag-file></div>', scope);
            var $element = angular.element(directive);
            expect($element.attr('draggable')).to.equal('true');
        });
    });
});
