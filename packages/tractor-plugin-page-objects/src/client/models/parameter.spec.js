// /*global beforeEach:true, describe:true, it:true */
// 'use strict';
//
// // Angular:
// var angular = require('angular');
// require('angular-mocks');
//
// // Test Utilities:
// var chai = require('chai');
//
// // Test setup:
// var expect = chai.expect;
//
// // Testing:
// require('./ParameterModel');
// var ParameterModel;
//
// describe('ParameterModel.js:', function () {
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_ParameterModel_) {
//             ParameterModel = _ParameterModel_;
//         });
//     });
//
//     describe('ParameterModel constructor:', function () {
//         it('should create a new `ParameterModel`:', function () {
//             var parameterModel = new ParameterModel();
//             expect(parameterModel).to.be.an.instanceof(ParameterModel);
//         });
//
//         it('should have default properties:', function () {
//             var action = {};
//
//             var parameterModel = new ParameterModel(action);
//
//             expect(parameterModel.action).to.equal(action);
//             expect(parameterModel.name).to.equal('');
//             expect(parameterModel.meta).to.deep.equal({
//                 name: ''
//             });
//         });
//     });
//
//     describe('ParameterModel.variableName:', function () {
//         it('should turn the full name of the Parameter into a JS variable:', function () {
//             var parameterModel = new ParameterModel();
//
//             parameterModel.name = 'A long name that describes the parameter.';
//             expect(parameterModel.variableName).to.equal('aLongNameThatDescribesTheParameter');
//         });
//     });
//
//     describe('ParameterModel.meta:', function () {
//         it('should contain the full name of the Parameter:', function () {
//             var parameterModel = new ParameterModel();
//
//             parameterModel.name = 'A long name that describes the parameter.';
//             expect(parameterModel.meta.name).to.equal('A long name that describes the parameter.');
//         });
//     });
//
//     describe('ParameterModel.ast:', function () {
//         it('should be the AST of the Parameter:', function () {
//             var escodegen = require('escodegen');
//
//             var parameterModel = new ParameterModel();
//             parameterModel.name = 'Parameter';
//             var ast = parameterModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('parameter');
//         });
//     });
//
//     describe('ParameterModel.getAllVariableNames:', function () {
//         it('should return the names of all the other Parameters assosciated with an Action:', function () {
//             var action = {
//                 parameters: [{
//                     name: 'parameter1'
//                 }, {
//                     name: 'parameter2'
//                 }]
//             };
//             var parameterModel = new ParameterModel(action);
//             expect(parameterModel.getAllVariableNames()).to.deep.equal(['parameter1', 'parameter2']);
//         });
//     });
// });
