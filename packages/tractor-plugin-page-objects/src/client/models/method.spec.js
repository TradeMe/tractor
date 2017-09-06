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
// require('./MethodModel');
// var MethodModel;
//
// describe('MethodModel.js:', function () {
//     var ArgumentModel;
//
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_MethodModel_, _ArgumentModel_) {
//             MethodModel = _MethodModel_;
//             ArgumentModel = _ArgumentModel_;
//         });
//     });
//
//     describe('MethodModel constructor:', function () {
//         it('should create a new `MethodModel`:', function () {
//             var methodModel = new MethodModel({}, {});
//             expect(methodModel).to.be.an.instanceof(MethodModel);
//         });
//
//         it('should have default properties:', function () {
//             var interaction = {};
//             var method = {};
//
//             var methodModel = new MethodModel(interaction, method);
//
//             expect(methodModel.interaction).to.equal(interaction);
//         });
//     });
//
//     describe('MethodModel.arguments:', function () {
//         it('should return the Arguments of the Method:', function () {
//             var method = {
//                 arguments: [{
//                     name: 'argument'
//                 }]
//             };
//
//             var methodModel = new MethodModel({}, method);
//
//             expect(methodModel.arguments.length).to.equal(1);
//             var argument = _.first(methodModel.arguments);
//             expect(argument).to.be.an.instanceof(ArgumentModel);
//             expect(argument.name).to.equal('argument');
//         });
//     });
//
//     describe('MethodModel.name:', function () {
//         it('should return the name of the Method:', function () {
//             var method = {
//                 name: 'method'
//             };
//
//             var methodModel = new MethodModel({}, method);
//
//             expect(methodModel.name).to.equal('method');
//         });
//     });
//
//     describe('MethodModel.description:', function () {
//         it('should return the description of the Method:', function () {
//             var method = {
//                 description: 'description'
//             };
//
//             var methodModel = new MethodModel({}, method);
//
//             expect(methodModel.description).to.equal('description');
//         });
//     });
//
//     describe('MethodModel.returns:', function () {
//         it('should return the type of the return value of the Method:', function () {
//             var method = {
//                 returns: 'string'
//             };
//
//             var methodModel = new MethodModel({}, method);
//
//             expect(methodModel.returns).to.equal('string');
//         });
//     });
//
//     describe('MethodModel[returns]:', function () {
//         it('should return the return value of the Method:', function () {
//             var method = {
//                 returns: 'string',
//                 string: 'returnValue'
//             };
//
//             var methodModel = new MethodModel({}, method);
//
//             expect(methodModel[methodModel.returns]).to.equal('returnValue');
//         });
//     });
// });
