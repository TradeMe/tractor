// /*global beforeEach:true, describe:true, it:true */
// 'use strict';
//
// // Angular:
// var angular = require('angular');
// require('angular-mocks');
//
// // Test Utilities:
// var chai = require('chai');
// var sinon = require('sinon');
// var sinonChai = require('sinon-chai');
//
// // Test setup:
// var expect = chai.expect;
// chai.use(sinonChai);
//
// // Mocks:
// var MockNotifierService = require('../Components/Notifier/NotifierService.mock');
//
// // Testing:
// var httpResponseInterceptor;
//
// describe('HttpResponseInterceptor.js:', function () {
//     var notifierService;
//
//     beforeEach(function () {
//         require('./HttpResponseInterceptor');
//
//         angular.module('Notifier', []);
//         angular.mock.module('Core');
//
//         angular.mock.module(function (_$httpProvider_, $provide) {
//             notifierService = new MockNotifierService();
//             $provide.factory('notifierService', function () {
//                 return notifierService;
//             });
//         });
//
//         angular.mock.inject(function (_httpResponseInterceptor_) {
//             httpResponseInterceptor = _httpResponseInterceptor_;
//         });
//     });
//
//     describe('HttpResponseInterceptor.response:', function () {
//         it('should return the `data` property off the `response` object:', function () {
//             var originalResponse = {
//                 data: 'data',
//                 config: {
//                     url: ''
//                 }
//             };
//             return httpResponseInterceptor.response(originalResponse)
//             .then(function (interceptedResponse) {
//                 expect(interceptedResponse).to.equal('data');
//             });
//         });
//
//         it('should return the original `response` if the URL ends in ".html":', function () {
//             var originalResponse = {
//                 data: 'data',
//                 config: {
//                     url: '.html'
//                 }
//             };
//             return httpResponseInterceptor.response(originalResponse)
//             .then(function (interceptedResponse) {
//                 expect(interceptedResponse).to.equal(originalResponse);
//             });
//         });
//     });
//
//     describe('HttpResponseInterceptor.responseError:', function () {
//         it('should pass any `error` property on the `response.data` to the `NotifierService`:', function () {
//             sinon.stub(notifierService, 'error');
//             var originalResponse = {
//                 data: {
//                     error: 'error'
//                 }
//             };
//             return httpResponseInterceptor.responseError(originalResponse)
//             .catch(function () {
//                 expect(notifierService.error).to.have.been.calledWith('error');
//             })
//             .finally(function () {
//                 notifierService.error.restore();
//             });
//         });
//     });
// });
