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
// var dirtyChai = require('dirty-chai');
// var sinon = require('sinon');
// var sinonChai = require('sinon-chai');
//
// // Test setup:
// var expect = chai.expect;
// chai.use(dirtyChai);
// chai.use(sinonChai);
//
// // Testing:
// require('./ElementModel');
// var ElementModel;
//
// // Mocks:
// var MockPageObjectModel = require('./PageObjectModel.mock.js');
//
// describe('ElementModel.js:', function () {
//     var FilterModel;
//
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_ElementModel_, _FilterModel_) {
//             ElementModel = _ElementModel_;
//             FilterModel = _FilterModel_;
//         });
//     });
//
//     describe('ElementModel constructor:', function () {
//         it('should create a new `ElementModel`:', function () {
//             var elementModel = new ElementModel();
//             expect(elementModel).to.be.an.instanceof(ElementModel);
//         });
//
//         it('should have default properties:', function () {
//             var pageObject = {};
//             var elementModel = new ElementModel(pageObject);
//
//             expect(elementModel.pageObject).to.equal(pageObject);
//             expect(elementModel.name).to.equal('');
//             expect(elementModel.filters).to.deep.equal([]);
//             expect(elementModel.sortableFilters).to.deep.equal([]);
//         });
//
//         it('should have data about all the element methods from Protractor:', function () {
//             var elementModel = new ElementModel();
//
//             expect(elementModel.methods.length).to.equal(12);
//
//             var click = elementModel.methods[0];
//             var sendKeys = elementModel.methods[1];
//             var getText = elementModel.methods[2];
//             var isEnabled = elementModel.methods[3];
//             var isSelected = elementModel.methods[4];
//             var submit = elementModel.methods[5];
//             var clear = elementModel.methods[6];
//             var isDisplayed = elementModel.methods[7];
//             var isPresent = elementModel.methods[8];
//             var getOuterHtml = elementModel.methods[9];
//             var getInnerHtml = elementModel.methods[10];
//             var getAttribute = elementModel.methods[11];
//
//             expect(click.name).to.equal('click');
//             expect(sendKeys.name).to.equal('sendKeys');
//             expect(getText.name).to.equal('getText');
//             expect(isEnabled.name).to.equal('isEnabled');
//             expect(isSelected.name).to.equal('isSelected');
//             expect(submit.name).to.equal('submit');
//             expect(clear.name).to.equal('clear');
//             expect(isDisplayed.name).to.equal('isDisplayed');
//             expect(isPresent.name).to.equal('isPresent');
//             expect(getOuterHtml.name).to.equal('getOuterHtml');
//             expect(getInnerHtml.name).to.equal('getInnerHtml');
//             expect(getAttribute.name).to.equal('getAttribute');
//         });
//     });
//
//     describe('ElementModel.selector:', function () {
//         it('should return the first Filter of the Element:', function () {
//             var filter = {};
//
//             var elementModel = new ElementModel();
//             elementModel.filters.push(filter);
//
//             expect(elementModel.selector).to.equal(filter);
//         });
//     });
//
//     describe('ElementModel.variableName:', function () {
//         it('should turn the full name of the Element into a JS variable:', function () {
//             var elementModel = new ElementModel();
//
//             elementModel.name = 'A long name that describes the action.';
//             expect(elementModel.variableName).to.equal('aLongNameThatDescribesTheAction');
//         });
//     });
//
//     describe('ElementModel.meta:', function () {
//         it('should contain the full name of the Element:', function () {
//             var elementModel = new ElementModel();
//
//             elementModel.name = 'A long name that describes the Element.';
//             expect(elementModel.meta.name).to.equal('A long name that describes the Element.');
//         });
//     });
//
//     describe('ElementModel.addFilter:', function () {
//         it('should add a new Filter to the Element:', function () {
//             var elementModel = new ElementModel();
//             elementModel.addFilter();
//
//             expect(elementModel.filters.length).to.equal(1);
//             var filter = _.first(elementModel.filters);
//             expect(filter).to.be.an.instanceof(FilterModel);
//         });
//
//         it('should add Filters to the `sortableFilters` list when there is more than one:', function () {
//             var elementModel = new ElementModel();
//             elementModel.addFilter();
//             elementModel.addFilter();
//
//             expect(elementModel.filters.length).to.equal(2);
//             expect(elementModel.sortableFilters.length).to.equal(1);
//         });
//     });
//
//     describe('ElementModel.removeFilter:', function () {
//         it('should remove a Filter from the Element:', function () {
//             var elementModel = new ElementModel();
//             elementModel.addFilter();
//
//             var filter = _.first(elementModel.filters);
//             elementModel.removeFilter(filter);
//             expect(elementModel.filters.length).to.equal(0);
//         });
//
//         it('should remove a Filter from the `sortableFilters` lists:', function () {
//             var elementModel = new ElementModel();
//             elementModel.addFilter();
//             elementModel.addFilter();
//
//             var filter = _.last(elementModel.filters);
//             elementModel.removeFilter(filter);
//
//             expect(elementModel.filters.length).to.equal(1);
//             expect(elementModel.sortableFilters.length).to.equal(0);
//         });
//     });
//
//     describe('ElementModel.getAllVariableNames:', function () {
//         it('should return all the variables associated with this Element\'s PageObject:', function () {
//             var pageObject = new MockPageObjectModel();
//             var allVariableNames = [];
//
//             var elementModel = new ElementModel(pageObject);
//
//             sinon.stub(pageObject, 'getAllVariableNames').returns(allVariableNames);
//
//             expect(elementModel.getAllVariableNames()).to.equal(allVariableNames);
//         });
//     });
//
//     describe('ElementModel.ast:', function () {
//         it('should be the AST of the Element for a single selector:', function () {
//             var escodegen = require('escodegen');
//
//             var elementModel = new ElementModel();
//             elementModel.name = 'element';
//             elementModel.addFilter();
//             var filter = _.first(elementModel.filters);
//             filter.type = 'binding';
//             filter.locator = '{{ model.binding }}';
//             var ast = elementModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'this.element = element(by.binding(\'{{ model.binding }}\'))'
//             );
//         });
//
//         it('should be the AST of the Element for a group selector:', function () {
//             var escodegen = require('escodegen');
//
//             var elementModel = new ElementModel();
//             elementModel.name = 'element';
//             elementModel.addFilter();
//             var filter = _.first(elementModel.filters);
//             filter.type = 'repeater';
//             filter.locator = 'item for item in list';
//             var ast = elementModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'this.element = element.all(by.repeater(\'item for item in list\'))'
//             );
//         });
//
//         it('should be the AST of the Element for a selector within a selector:', function () {
//             var escodegen = require('escodegen');
//
//             var elementModel = new ElementModel();
//             elementModel.name = 'element';
//             elementModel.addFilter();
//             elementModel.addFilter();
//             var filterOne = _.first(elementModel.filters);
//             filterOne.type = 'binding';
//             filterOne.locator = '{{ model.binding }}';
//             var filterTwo = _.last(elementModel.filters);
//             filterTwo.type = 'model';
//             filterTwo.locator = 'model.property';
//             var ast = elementModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'this.element = element(by.binding(\'{{ model.binding }}\')).element(by.model(\'model.property\'))'
//             );
//         });
//
//         it('should be the AST of the Element for a index within a group selector:', function () {
//             var escodegen = require('escodegen');
//
//             var elementModel = new ElementModel();
//             elementModel.name = 'element';
//             elementModel.addFilter();
//             elementModel.addFilter();
//             var filterOne = _.first(elementModel.filters);
//             filterOne.type = 'repeater';
//             filterOne.locator = 'item for item in list';
//             var filterTwo = _.last(elementModel.filters);
//             filterTwo.type = 'text';
//             filterTwo.locator = '0';
//             var ast = elementModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'this.element = element.all(by.repeater(\'item for item in list\')).get(0)'
//             );
//         });
//
//         it('should be the AST of the Element for a text selector within a group selector:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var elementModel = new ElementModel();
//             elementModel.name = 'element';
//             elementModel.addFilter();
//             elementModel.addFilter();
//             var filterOne = _.first(elementModel.filters);
//             filterOne.type = 'repeater';
//             filterOne.locator = 'item for item in list';
//             var filterTwo = _.last(elementModel.filters);
//             filterTwo.type = 'text';
//             filterTwo.locator = 'text';
//             var ast = elementModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'this.element = element.all(by.repeater(\'item for item in list\')).filter(function (element) {' + os.EOL +
//                 '    return element.getText().then(function (text) {' + os.EOL +
//                 '        return text.indexOf(\'text\') !== -1;' + os.EOL +
//                 '    });' + os.EOL +
//                 '}).get(0)'
//             );
//         });
//
//         it('should be the AST of the Element for a group selector within a selector:', function () {
//             var escodegen = require('escodegen');
//
//             var elementModel = new ElementModel();
//             elementModel.name = 'element';
//             elementModel.addFilter();
//             elementModel.addFilter();
//             var filterOne = _.first(elementModel.filters);
//             filterOne.type = 'binding';
//             filterOne.locator = '{{ model.binding }}';
//             var filterTwo = _.last(elementModel.filters);
//             filterTwo.type = 'repeater';
//             filterTwo.locator = 'item for item in list';
//             var ast = elementModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'this.element = element(by.binding(\'{{ model.binding }}\')).all(by.repeater(\'item for item in list\'))'
//             );
//         });
//     });
// });
