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
// require('./InteractionModel');
// var InteractionModel;
//
// describe('InteractionModel.js:', function () {
//     var MethodModel;
//
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_InteractionModel_, _MethodModel_) {
//             InteractionModel = _InteractionModel_;
//             MethodModel = _MethodModel_;
//         });
//     });
//
//     describe('InteractionModel constructor:', function () {
//         it('should create a new `InteractionModel`:', function () {
//             var interactionModel = new InteractionModel();
//             expect(interactionModel).to.be.an.instanceof(InteractionModel);
//         });
//
//         it('should have default properties:', function () {
//             var action = {};
//
//             var interactionModel = new InteractionModel(action);
//
//             expect(interactionModel.action).to.equal(action);
//         });
//     });
//
//     describe('InteractionModel.element:', function () {
//         it('should return the Element that the Interaction occurs on:', function () {
//             var method = {
//                 arguments: []
//             };
//             var element = {
//                 methods: [method]
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.element = element;
//
//             expect(interactionModel.element).to.equal(element);
//         });
//
//         it('should set the `method` of the Interaction to the first Method of the Element:', function () {
//             var method = {
//                 arguments: []
//             };
//             var element = {
//                 methods: [method]
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.element = element;
//
//             expect(interactionModel.method).to.equal(method);
//         });
//     });
//
//     describe('InteractionModel.method:', function () {
//         it('should return the Method to be called on the Element:', function () {
//             var method = {
//                 arguments: []
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.method = method;
//
//             expect(interactionModel.method).to.equal(method);
//         });
//
//         it('should set the `methodInstance` of the Interaction to a new MethodModel:', function () {
//             var method = {
//                 arguments: []
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.method = method;
//
//             expect(interactionModel.methodInstance).to.be.an.instanceof(MethodModel);
//         });
//     });
//
//     describe('InteractionModel.arguments:', function () {
//         it('should return the arguments required for the Method of the Interaction:', function () {
//             var method = {
//                 arguments: []
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.method = method;
//
//             expect(interactionModel.arguments).to.deep.equal([]);
//         });
//     });
//
//     describe('InteractionModel.ast:', function () {
//         it('should be the AST of the Interaction:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObject = {};
//             var method = {
//                 name: 'method'
//             };
//             var element = {
//                 pageObject: pageObject,
//                 variableName: 'element',
//                 methods: [method]
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.element = element;
//             var ast = interactionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'new Promise(function (resolve) {' + os.EOL +
//                 '    resolve(self.element.method());' + os.EOL +
//                 '})'
//             );
//         });
//
//         it('should handle a method on a plugin:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var method = {
//                 name: 'method'
//             };
//             var plugin = {
//                 variableName: 'plugin',
//                 methods: [method]
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.element = plugin;
//             var ast = interactionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'new Promise(function (resolve) {' + os.EOL +
//                 '    resolve(plugin.method());' + os.EOL +
//                 '})'
//             );
//         });
//
//         it('should handle methods that return a promise:', function () {
//             var escodegen = require('escodegen');
//
//             var pageObject = {};
//             var method = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var element = {
//                 pageObject: pageObject,
//                 variableName: 'element',
//                 methods: [method]
//             };
//
//             var interactionModel = new InteractionModel();
//             interactionModel.element = element;
//             var ast = interactionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'self.element.method()'
//             );
//         });
//
//         it('should handle methods that have arguments:', function () {
//             var escodegen = require('escodegen');
//
//             var argument = {};
//             var action = {
//                 parameters: [],
//                 interactions: []
//             };
//             var pageObject = {};
//             var method = {
//                 name: 'method',
//                 returns: 'promise',
//                 arguments: [argument]
//             };
//             var element = {
//                 pageObject: pageObject,
//                 variableName: 'element',
//                 methods: [method]
//             };
//
//             var interactionModel = new InteractionModel(action);
//             interactionModel.element = element;
//             var argumentOne = _.first(interactionModel.arguments);
//             argumentOne.value = 'someArgument';
//             var ast = interactionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'self.element.method(\'someArgument\')'
//             );
//         });
//     });
// });
