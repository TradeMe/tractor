// /*global beforeEach:true, describe:true, it:true */
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
// // Testing:
// require('./ArgumentModel');
// var ArgumentModel;
//
// describe('ArgumentModel.js:', function () {
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_ArgumentModel_) {
//             ArgumentModel = _ArgumentModel_;
//         });
//     });
//
//     describe('ArgumentModel constructor:', function () {
//         it('should create a new `ArgumentModel`:', function () {
//             var actionModel = new ArgumentModel();
//             expect(actionModel).to.be.an.instanceof(ArgumentModel);
//         });
//
//         it('should have default properties:', function () {
//             var method = {};
//
//             var argumentModel = new ArgumentModel(method);
//
//             expect(argumentModel.method).to.equal(method);
//             expect(argumentModel.name).to.be.false();
//             expect(argumentModel.description).to.be.false();
//             expect(argumentModel.type).to.be.false();
//             expect(argumentModel.required).to.be.false();
//             expect(argumentModel.value).to.equal('');
//         });
//     });
//
//     describe('ArgumentModel.method:', function () {
//         it('should return the Method that this Argument belongs to:', function () {
//             var method = {};
//
//             var argumentModel = new ArgumentModel(method);
//
//             expect(argumentModel.method).to.equal(method);
//         });
//
//         it('should return `null` if there is not a Method:', function () {
//             var argumentModel = new ArgumentModel();
//
//             expect(argumentModel.method).to.be.null();
//         });
//     });
//
//     describe('ArgumentModel.name:', function () {
//         it('should return the name of the Argument:', function () {
//             var argument = {
//                 name: 'argument'
//             };
//             var argumentModel = new ArgumentModel({}, argument);
//
//             expect(argumentModel.name).to.equal('argument');
//         });
//     });
//
//     describe('ArgumentModel.description:', function () {
//         it('should return the description of the Argument:', function () {
//             var argument = {
//                 description: 'description'
//             };
//             var argumentModel = new ArgumentModel({}, argument);
//
//             expect(argumentModel.description).to.equal('description');
//         });
//     });
//
//     describe('ArgumentModel.type:', function () {
//         it('should return the type of the Argument:', function () {
//             var argument = {
//                 type: 'type'
//             };
//             var argumentModel = new ArgumentModel({}, argument);
//
//             expect(argumentModel.type).to.equal('type');
//         });
//     });
//
//     describe('ArgumentModel.required:', function () {
//         it('should return the type of the Argument:', function () {
//             var argument = {
//                 required: true
//             };
//             var argumentModel = new ArgumentModel({}, argument);
//
//             expect(argumentModel.required).to.be.true();
//         });
//     });
//
//     describe('ArgumentModel.ast:', function () {
//         it('should return a literal value for JavaScript literals:', function () {
//             var escodegen = require('escodegen');
//
//             var argumentModel = new ArgumentModel();
//             argumentModel.value = 'true';
//             var ast = argumentModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('true');
//         });
//
//         it('should return an identifier if the Argument value matches a parameter of the action:', function () {
//             var escodegen = require('escodegen');
//
//             var parameter = {
//                 name: 'parameter',
//                 variableName: 'parameter'
//             };
//             var interaction = {
//                 method: {}
//             };
//             var method = {
//                 interaction: {
//                     action: {
//                         parameters: [parameter],
//                         interactions: [interaction]
//                     }
//                 }
//             };
//
//             var argumentModel = new ArgumentModel(method);
//             argumentModel.value = 'parameter';
//             var ast = argumentModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('parameter');
//         });
//
//         it('should return an identifier if the Argument value matches the return value of an interaction:', function () {
//             var escodegen = require('escodegen');
//
//             var interaction = {
//                 method: {
//                     string: {
//                         name: 'returnValue'
//                     },
//                     returns: 'string'
//                 }
//             };
//             var method = {
//                 interaction: {
//                     action: {
//                         parameters: [],
//                         interactions: [interaction]
//                     }
//                 }
//             };
//
//             var argumentModel = new ArgumentModel(method);
//             argumentModel.value = 'returnValue';
//             var ast = argumentModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('returnValue');
//         });
//
//         it('should return null if the Argument has no value:', function () {
//             var escodegen = require('escodegen');
//
//             var argumentModel = new ArgumentModel();
//             argumentModel.value = '';
//             var ast = argumentModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('null');
//         });
//     });
// });
