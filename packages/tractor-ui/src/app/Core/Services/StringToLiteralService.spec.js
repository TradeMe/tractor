// /*global beforeEach:true, describe:true, it:true */
// 'use strict';
//
// // Angular:
// var angular = require('angular');
// require('angular-mocks');
//
// // Utilities:
// var _ = require('lodash');
//
// // Test Utilities:
// var chai = require('chai');
//
// // Test setup:
// var expect = chai.expect;
//
// // Testing:
// require('./StringToLiteralService');
// var stringToLiteralService;
//
// describe('StringToLiteralService.js:', function () {
//     beforeEach(function () {
//         angular.mock.module('Core');
//
//         angular.mock.inject(function (_stringToLiteralService_) {
//             stringToLiteralService = _stringToLiteralService_;
//         });
//     });
//
//     describe('StringToLiteralService.toLiteral:', function () {
//         it('should turn string values into their JavaScript literal equivalents:', function () {
//             var tests = [{
//                 string: 'true',
//                 literal: true
//             }, {
//                 string: 'false',
//                 literal: false
//             }, {
//                 string: '-0.33',
//                 literal: -0.33
//             }, {
//                 string: 'Infinity',
//                 literal: Infinity
//             }, {
//                 string: 'NaN',
//                 literal: NaN
//             }, {
//                 string: 'null',
//                 literal: null
//             }, {
//                 string: 'just a string',
//                 literal: 'just a string'
//             }];
//
//             _.each(tests, function (test) {
//                 expect(stringToLiteralService.toLiteral(test.string)).to.deep.equal(test.literal);
//             });
//         });
//     });
// });
