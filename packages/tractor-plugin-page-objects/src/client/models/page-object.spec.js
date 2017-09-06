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
//
// // Test setup:
// var expect = chai.expect;
// chai.use(dirtyChai);
//
// // Testing:
// require('./PageObjectModel');
// var PageObjectModel;
//
// describe('PageObjectModel.js:', function () {
//     var ElementModel;
//     var FilterModel;
//     var ActionModel;
//     var InteractionModel;
//
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.module(function ($provide) {
//             $provide.factory('plugins', function () {
//                 return [{
//                     name: 'plugin',
//                     variableName: 'plugin',
//                     methods: [{
//                         name: 'method',
//                         description: 'does a thing',
//                         arguments: [{
//                             name: 'argumentOne',
//                             description: 'some argument',
//                             type: 'string',
//                             required: true
//                         }, {
//                             name: 'argumentTwo',
//                             description: 'another argument',
//                             type: 'number'
//                         }]
//                     }]
//                 }];
//             });
//         });
//
//         angular.mock.inject(function (_PageObjectModel_, _ElementModel_, _FilterModel_, _ActionModel_, _InteractionModel_) {
//             PageObjectModel = _PageObjectModel_;
//             ElementModel = _ElementModel_;
//             FilterModel = _FilterModel_;
//             ActionModel = _ActionModel_;
//             InteractionModel = _InteractionModel_;
//         });
//     });
//
//     describe('PageObjectModel constructor:', function () {
//         it('should create a new `PageObjectModel`:', function () {
//             var pageObjectModel = new PageObjectModel();
//             expect(pageObjectModel).to.be.an.instanceof(PageObjectModel);
//         });
//
//         it('should have default properties:', function () {
//             var pageObjectModel = new PageObjectModel();
//
//             expect(pageObjectModel.elements.length).to.equal(1);
//             expect(pageObjectModel.domElements.length).to.equal(0);
//             expect(pageObjectModel.actions.length).to.equal(0);
//             expect(pageObjectModel.name).to.equal('');
//             expect(pageObjectModel.meta).to.equal(JSON.stringify({
//                 name: '',
//                 elements: [],
//                 actions: []
//             }));
//         });
//     });
//
//     describe('PageObjectModel.isSaved:', function () {
//         it('should be false by default:', function () {
//             var pageObjectModel = new PageObjectModel();
//
//             expect(pageObjectModel.isSaved).to.be.false();
//         });
//
//         it('should get the value from the given `options`:', function () {
//             var options = {
//                 isSaved: true
//             };
//             var pageObjectModel = new PageObjectModel(options);
//
//             expect(pageObjectModel.isSaved).to.be.true();
//         });
//     });
//
//     describe('PageObjectModel.url:', function () {
//         it('should get the value from the given `options`:', function () {
//             var options = {
//                 url: 'url'
//             };
//             var pageObjectModel = new PageObjectModel(options);
//
//             expect(pageObjectModel.url).to.equal('url');
//         });
//     });
//
//     describe('PageObjectModel.variableName:', function () {
//         it('should turn the full name of the Page Object into a JS variable:', function () {
//             var pageObjectModel = new PageObjectModel();
//
//             pageObjectModel.name = 'A long name that describes the Page Object.';
//             expect(pageObjectModel.variableName).to.equal('ALongNameThatDescribesThePageObject');
//         });
//     });
//
//     describe('PageObjectModel.meta:', function () {
//         it('should contain the full name of the Page Object:', function () {
//             var pageObjectModel = new PageObjectModel();
//
//             pageObjectModel.name = 'A long name that describes the Page Object.';
//             expect(JSON.parse(pageObjectModel.meta).name).to.equal('A long name that describes the PageObject.');
//         });
//
//         it('should contain the meta data for the Elements of the Page Object:', function () {
//             var elementMeta = { name: 'element' };
//             var element = { meta: elementMeta };
//
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.domElements.push(element);
//
//             expect(_.first(JSON.parse(pageObjectModel.meta).elements)).to.deep.equal(elementMeta);
//         });
//
//         it('should contain the meta data for the Actions of the Page Object:', function () {
//             var actionMeta = { name: 'action' };
//             var action = { meta: actionMeta };
//
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.actions.push(action);
//
//             expect(_.first(JSON.parse(pageObjectModel.meta).actions)).to.deep.equal(actionMeta);
//         });
//     });
//
//     describe('PageObjectModel.ast:', function () {
//         it('should be the AST of the Page Object:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.name = 'PageObject';
//             var ast = pageObjectModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'module.exports = function () {' + os.EOL +
//                 '    var PageObject = function PageObject() {' + os.EOL +
//                 '    };' + os.EOL +
//                 '    return PageObject;' + os.EOL +
//                 '}();'
//             );
//         });
//
//         it('should include Elements of the Page Object:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.name = 'PageObject';
//             pageObjectModel.addElement();
//             var element = _.first(pageObjectModel.domElements);
//             element.name = 'element';
//             var filter = _.first(element.filters);
//             filter.type = 'binding';
//             filter.locator = '{{ model.binding }}';
//             var ast = pageObjectModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'module.exports = function () {' + os.EOL +
//                 '    var PageObject = function PageObject() {' + os.EOL +
//                 '        this.element = element(by.binding(\'{{ model.binding }}\'));' + os.EOL +
//                 '    };' + os.EOL +
//                 '    return PageObject;' + os.EOL +
//                 '}();'
//             );
//         });
//
//         it('should include Actions of the Page Object:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.name = 'PageObject';
//             pageObjectModel.addAction();
//             var action = _.first(pageObjectModel.actions);
//             action.name = 'action';
//             var ast = pageObjectModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'module.exports = function () {' + os.EOL +
//                 '    var PageObject = function PageObject() {' + os.EOL +
//                 '    };' + os.EOL +
//                 '    PageObject.prototype.action = function () {' + os.EOL +
//                 '        var self = this;' + os.EOL +
//                 '        return new Promise(function (resolve) {' + os.EOL +
//                 '            resolve(plugin.method(null, null));' + os.EOL +
//                 '        });' + os.EOL +
//                 '    };' + os.EOL +
//                 '    return PageObject;' + os.EOL +
//                 '}();'
//             );
//         });
//     });
//
//     describe('PageObjectModel.data:', function () {
//         it('should be an alias for the AST of the Page Object:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.name = 'PageObject';
//
//             expect(pageObjectModel.ast).to.deep.equal(pageObjectModel.data);
//         });
//     });
//
//     describe('PageObjectModel.addElement:', function () {
//         it('should add a new Element to the Page Object:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.addElement();
//
//             expect(pageObjectModel.elements.length).to.equal(2);
//             expect(pageObjectModel.domElements.length).to.equal(1);
//             var element = _.first(pageObjectModel.domElements);
//             expect(element).to.be.an.instanceof(ElementModel);
//         });
//
//         it('should add a new Filter to the new Element:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.addElement();
//
//             var element = _.first(pageObjectModel.domElements);
//             expect(element.filters.length).to.equal(1);
//             var filter = _.first(element.filters);
//             expect(filter).to.be.an.instanceof(FilterModel);
//         });
//     });
//
//     describe('PageObjectModel.removeElement:', function () {
//         it('should remove a Element from the Page Object:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.addElement();
//
//             var element = _.first(pageObjectModel.domElements);
//             pageObjectModel.removeElement(element);
//             expect(pageObjectModel.domElements.length).to.equal(0);
//             expect(pageObjectModel.elements.length).to.equal(1);
//         });
//     });
//
//     describe('PageObjectModel.addAction:', function () {
//         it('should add a new Action to the Page Object:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.addAction();
//
//             expect(pageObjectModel.actions.length).to.equal(1);
//             var action = _.first(pageObjectModel.actions);
//             expect(action).to.be.an.instanceof(ActionModel);
//         });
//
//         it('should add a new Interaction to the new Action:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.addAction();
//
//             var action = _.first(pageObjectModel.actions);
//             expect(action.interactions.length).to.equal(1);
//             var interaction = _.first(action.interactions);
//             expect(interaction).to.be.an.instanceof(InteractionModel);
//         });
//     });
//
//     describe('PageObjectModel.removeAction:', function () {
//         it('should remove a Action from the Page Object:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.addAction();
//
//             var action = _.first(pageObjectModel.actions);
//             pageObjectModel.removeAction(action);
//             expect(pageObjectModel.actions.length).to.equal(0);
//         });
//     });
//
//     describe('PageObjectModel.getAllVariableNames:', function () {
//         it('should return all the variables associated with this Page Object:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.name = 'PageObject';
//             pageObjectModel.addElement();
//             var element = _.first(pageObjectModel.domElements);
//             element.name = 'element';
//             pageObjectModel.addAction();
//             var action = _.first(pageObjectModel.actions);
//             action.name = 'action';
//
//             expect(pageObjectModel.getAllVariableNames()).to.deep.equal(['plugin', 'element', 'action']);
//         });
//
//         it('should exclude the variable name of the given from the list:', function () {
//             var pageObjectModel = new PageObjectModel();
//             pageObjectModel.name = 'pageObject';
//             pageObjectModel.addElement();
//             var element = _.first(pageObjectModel.domElements);
//             element.name = 'element';
//             pageObjectModel.addAction();
//             var action = _.first(pageObjectModel.actions);
//             action.name = 'action';
//
//             expect(pageObjectModel.getAllVariableNames(action)).to.deep.equal(['pageObject', 'plugin', 'element']);
//         });
//     });
// });
