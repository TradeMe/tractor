// /*global describe:true, beforeEach:true, it:true */
// 'use strict';
//
// // Angular:
// var angular = require('angular');
// require('angular-mocks');
//
// // Test Utilities:
// var chai = require('chai');
// var dirtyChai = require('dirty-chai');
//
// // Test setup:
// var expect = chai.expect;
// chai.use(dirtyChai);
//
// // Mocks:
// var MockHttpResponseInterceptor = require('../../Services/HttpResponseInterceptor.mock');
//
// // Testing:
// require('./ActionDirective');
//
// describe('ActionDirective.js:', function() {
//     var $compile;
//     var $rootScope;
//
//     beforeEach(function () {
//         angular.mock.module('Core');
//
//         angular.mock.module(function ($provide) {
//             $provide.factory('HttpResponseInterceptor', function () {
//                 return new MockHttpResponseInterceptor();
//             });
//         });
//
//         angular.mock.inject(function (_$compile_, _$rootScope_) {
//             $compile = _$compile_;
//             $rootScope = _$rootScope_;
//         });
//     });
//
//     var compileDirective = function (template, scope) {
//         var directive = $compile(template)(scope);
//         scope.$digest();
//         return directive;
//     };
//
//     describe('Link function:', function () {
//         it('should throw an error when `model` is not passed in:', function () {
//             expect(function () {
//                 var scope = $rootScope.$new();
//                 compileDirective('<tractor-action></tractor-action>', scope);
//             }).to.throw('The "tractor-action" directive requires a "model" attribute.');
//         });
//
//         it('should throw an error when `action` is not passed in:', function () {
//             expect(function () {
//                 var scope = $rootScope.$new();
//                 scope.model = {};
//                 compileDirective('<tractor-action model="model"></tractor-action>', scope);
//             }).to.throw('The "tractor-action" directive requires an "action" attribute.');
//         });
//
//         it('should successfully compile the directive otherwise:', function () {
//             expect(function () {
//                 var scope = $rootScope.$new();
//                 scope.model = {};
//                 compileDirective('<tractor-action model="model" action="Some Action"></tractor-action>', scope);
//             }).not.to.throw();
//         });
//
//         it('should convert the "action" attribute into a camel-cased "method":', function () {
//             var scope = $rootScope.$new();
//             scope.model = {};
//             var directive = compileDirective('<tractor-action model="model" action="Some Action"></tractor-action>', scope);
//             expect(directive.isolateScope().method).to.equal('someAction');
//         });
//     });
// });
