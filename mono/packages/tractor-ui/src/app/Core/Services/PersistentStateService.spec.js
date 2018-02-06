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
//
// // Test setup:
// var expect = chai.expect;
//
// // Testing:
// require('./PersistentStateService');
// var persistentStateService;
//
// // Mocks:
// var MockLocalStorageService = require('./LocalStorageService.mock');
//
// describe('PersistentStateService.js:', function () {
//     var localStorageService;
//
//     beforeEach(function () {
//         angular.mock.module('Core');
//
//         angular.mock.module(function ($provide) {
//             localStorageService = new MockLocalStorageService();
//             $provide.factory('localStorageService', function () {
//                 return localStorageService;
//             });
//         });
//
//         angular.mock.inject(function (_$httpBackend_, _persistentStateService_) {
//             persistentStateService = _persistentStateService_;
//         });
//     });
//
//     describe('persistentStateService.get:', function () {
//         it('should get a value from the current saved state:', function () {
//             var state = {
//                 key: 'value'
//             };
//
//             sinon.stub(localStorageService, 'get').returns(state);
//
//             var value = persistentStateService.get('key');
//
//             expect(value).to.equal('value');
//
//             localStorageService.get.restore();
//         });
//
//         it('should return an empty object when the current saved state is empty:', function () {
//             sinon.stub(localStorageService, 'get').returns(null);
//
//             var value = persistentStateService.get('key');
//
//             expect(value).to.deep.equal({});
//
//             localStorageService.get.restore();
//         });
//
//         it('should return an empty object when there is not an associated key on the saved state:', function () {
//             var state = {};
//
//             sinon.stub(localStorageService, 'get').returns(state);
//
//             var value = persistentStateService.get('key');
//
//             expect(value).to.deep.equal({});
//
//             localStorageService.get.restore();
//         });
//     });
//
//     describe('persistentStateService.set:', function () {
//         it('should set a value on the current saved state:', function () {
//             var state = {};
//
//             sinon.stub(localStorageService, 'get').returns(state);
//             sinon.stub(localStorageService, 'set');
//
//             persistentStateService.set('key', 'value');
//
//             var call = localStorageService.set.getCall(0);
//             var newState = call.args[1];
//             expect(newState).to.deep.equal({ key: 'value' });
//
//             localStorageService.get.restore();
//             localStorageService.set.restore();
//         });
//
//         it('should create an object to represent the saved state and set a value to it:', function () {
//             sinon.stub(localStorageService, 'get').returns(null);
//             sinon.stub(localStorageService, 'set');
//
//             persistentStateService.set('key', 'value');
//
//             var call = localStorageService.set.getCall(0);
//             var newState = call.args[1];
//             expect(newState).to.deep.equal({ key: 'value' });
//
//             localStorageService.get.restore();
//             localStorageService.set.restore();
//         });
//     });
//
//     describe('persistentStateService.remove:', function () {
//         it('should remove a value from the current saved state:', function () {
//             var state = {
//                 key: 'value'
//             };
//
//             sinon.stub(localStorageService, 'get').returns(state);
//             sinon.stub(localStorageService, 'set');
//
//             persistentStateService.remove('key');
//
//             var call = localStorageService.set.getCall(0);
//             var newState = call.args[1];
//             expect(newState).to.deep.equal({});
//
//             localStorageService.get.restore();
//             localStorageService.set.restore();
//         });
//
//         it('should still work if there is no saved state:', function () {
//             sinon.stub(localStorageService, 'get').returns(null);
//             sinon.stub(localStorageService, 'set');
//
//             persistentStateService.remove('key');
//
//             var call = localStorageService.set.getCall(0);
//             var newState = call.args[1];
//             expect(newState).to.deep.equal({});
//
//             localStorageService.get.restore();
//             localStorageService.set.restore();
//         });
//     });
// });
