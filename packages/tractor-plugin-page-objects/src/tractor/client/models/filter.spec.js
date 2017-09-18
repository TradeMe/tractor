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
// require('./FilterModel');
// var FilterModel;
//
// describe('FilterModel.js:', function () {
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_FilterModel_) {
//             FilterModel = _FilterModel_;
//         });
//     });
//
//     describe('FilterModel constructor:', function () {
//         it('should create a new `FilterModel`:', function () {
//             var filterModel = new FilterModel();
//             expect(filterModel).to.be.an.instanceof(FilterModel);
//         });
//
//         it('should have default properties:', function () {
//             var element = {};
//             var filterModel = new FilterModel(element);
//
//             expect(filterModel.element).to.equal(element);
//             expect(filterModel.type).to.equal('model');
//             expect(filterModel.locator).to.equal('');
//         });
//     });
//
//     describe('FilterModel.types:', function () {
//         it('should contain all the possible types of Filter:', function () {
//             var filterModel = new FilterModel();
//             expect(filterModel.types).to.deep.equal(
//                 ['model', 'binding', 'text', 'css', 'options', 'repeater', 'buttonText', 'linkText']
//             );
//         });
//     });
//
//     describe('FilterModel.isGroup:', function () {
//         it('should return true if `type` is \'options\':', function () {
//             var filterModel = new FilterModel();
//             filterModel.type = 'options';
//
//             expect(filterModel.isGroup).to.be.true();
//         });
//
//         it('should return true if `type` is \'repeater\':', function () {
//             var filterModel = new FilterModel();
//             filterModel.type = 'repeater';
//
//             expect(filterModel.isGroup).to.be.true();
//         });
//
//         it('should return false otherwise:', function () {
//             var filterModel = new FilterModel();
//
//             expect(filterModel.isGroup).to.be.false();
//         });
//     });
//
//     describe('FilterModel.isText:', function () {
//         it('should return true if `type` is \'text\':', function () {
//             var filterModel = new FilterModel();
//             filterModel.type = 'text';
//
//             expect(filterModel.isText).to.be.true();
//         });
//
//         it('should return false otherwise:', function () {
//             var filterModel = new FilterModel();
//
//             expect(filterModel.isText).to.be.false();
//         });
//     });
//
//     describe('FilterModel.ast:', function () {
//         it('should return the AST for a Filter where `isNested` and `isText` are both false:', function () {
//             var escodegen = require('escodegen');
//
//             var filterModel = new FilterModel();
//             filterModel.locator = 'model.property';
//             var ast = filterModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('by.model(\'model.property\')');
//         });
//
//         it('should return the AST for a Filter where `isNested` is `false` and `isText` is true:', function () {
//             var escodegen = require('escodegen');
//
//             var filterModel = new FilterModel();
//             filterModel.type = 'text';
//             filterModel.locator = 'text locator';
//             var ast = filterModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('by.cssContainingText(\'*\', \'text locator\')');
//         });
//
//         it('should return the AST for a Filter where `isNested` is `true` and the value is a number:', function () {
//             var escodegen = require('escodegen');
//
//             var filterModel = new FilterModel();
//             filterModel.type = 'text';
//             filterModel.isNested = true;
//             filterModel.locator = '0';
//             var ast = filterModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal('0');
//         });
//
//         it('should return the AST for a Filter where `isNested` is `true` and the value is text:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var filterModel = new FilterModel();
//             filterModel.type = 'text';
//             filterModel.isNested = true;
//             filterModel.locator = 'text locator';
//             var ast = filterModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'function (element) {' + os.EOL +
//                 '    return element.getText().then(function (text) {' + os.EOL +
//                 '        return text.indexOf(\'text locator\') !== -1;' + os.EOL +
//                 '    });' + os.EOL +
//                 '}'
//             );
//         });
//     });
// });
