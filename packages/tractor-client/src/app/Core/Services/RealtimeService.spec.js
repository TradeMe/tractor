// /*global beforeEach:true, describe:true, it:true */
// 'use strict';
//
// // Angular:
// var angular = require('angular');
// require('angular-mocks');
//
// // Utilities:
// var Promise = require('bluebird');
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
// // Testing:
// require('./RealTimeService');
// var realTimeService;
//
// describe('RealTimeService.js:', function () {
//     var config;
//
//     beforeEach(function () {
//         angular.mock.module('Core');
//
//         angular.mock.module(function ($provide) {
//             config = { };
//             $provide.factory('config', function () {
//                 return config;
//             });
//         });
//
//         angular.mock.inject(function (_realTimeService_) {
//             realTimeService = _realTimeService_;
//         });
//     });
//
//     describe('RealTimeService.connect:', function () {
//         it('should connect to the given room via the port in the config:', function () {
//             var socket = require('socket.io-client');
//             var connection = {};
//
//             config.port = 1234;
//             sinon.stub(socket, 'connect').returns(connection);
//
//             var connected = realTimeService.connect('room');
//
//             expect(connected).to.equal(connection);
//             expect(socket.connect).to.have.been.calledWith('http://localhost:1234/room');
//
//             socket.connect.restore();
//         });
//
//         it('should attach the given events to the connection:', function () {
//             var socket = require('socket.io-client');
//             var connection = {
//                 on: angular.noop
//             };
//             var events = {
//                 event: angular.noop
//             };
//
//             sinon.stub(socket, 'connect').returns(connection);
//             sinon.spy(connection, 'on');
//
//             realTimeService.connect('room', events);
//
//             expect(connection.on).to.have.been.calledWith('event', angular.noop);
//
//             socket.connect.restore();
//         });
//     });
// });
