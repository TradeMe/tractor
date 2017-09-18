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
// var sinon = require('sinon');
// var sinonChai = require('sinon-chai');
//
// // Test setup:
// var expect = chai.expect;
// chai.use(sinonChai);
//
// // Testing:
// require('./action');
// var ActionModel;
//
// describe('tractor-plugin-page-objects: ActionModel:', function () {
//     var PageObjectModel;
//     var InteractionModel;
//     var ParameterModel;
//
//     beforeEach(function () {
//         angular.mock.module('PageObjectEditor');
//
//         angular.mock.inject(function (_ActionModel_, _PageObjectModel_, _ParameterModel_, _InteractionModel_) {
//             ActionModel = _ActionModel_;
//             PageObjectModel = _PageObjectModel_;
//             ParameterModel = _ParameterModel_;
//             InteractionModel = _InteractionModel_;
//         });
//     });
//
//     describe('ActionModel constructor:', function () {
//         it('should create a new `ActionModel`:', function () {
//             var actionModel = new ActionModel();
//             expect(actionModel).to.be.an.instanceof(ActionModel);
//         });
//
//         it('should have default properties:', function () {
//             var pageObject = {};
//
//             var actionModel = new ActionModel(pageObject);
//
//             expect(actionModel.pageObject).to.equal(pageObject);
//             expect(actionModel.interactions.length).to.equal(0);
//             expect(actionModel.parameters.length).to.equal(0);
//             expect(actionModel.name).to.equal('');
//             expect(actionModel.meta).to.deep.equal({
//                 name: '',
//                 parameters: []
//             });
//         });
//     });
//
//     describe('ActionModel.variableName:', function () {
//         it('should turn the full name of the Action into a JS variable:', function () {
//             var actionModel = new ActionModel();
//
//             actionModel.name = 'A long name that describes the action.';
//             expect(actionModel.variableName).to.equal('aLongNameThatDescribesTheAction');
//         });
//     });
//
//     describe('ActionModel.meta:', function () {
//         it('should contain the full name of the Action:', function () {
//             var actionModel = new ActionModel();
//
//             actionModel.name = 'A long name that describes the Action.';
//             expect(actionModel.meta.name).to.equal('A long name that describes the Action.');
//         });
//
//         it('should contain the meta data for the Parameters of the Action:', function () {
//             var parameterMeta = {};
//             var parameter = { meta: parameterMeta };
//
//             var actionModel = new ActionModel();
//             actionModel.parameters.push(parameter);
//
//             expect(_.first(actionModel.meta.parameters)).to.equal(parameterMeta);
//         });
//     });
//
//     describe('ActionModel.ast:', function () {
//         it('should be the AST of the Action:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObject = {
//                 variableName: 'PageObject'
//             };
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function () {' + os.EOL +
//                 '}'
//             );
//         });
//
//         it('should include any Parameters of the Action:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var pageObject = {
//                 variableName: 'PageObject'
//             };
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             actionModel.addParameter();
//             var parameter = _.first(actionModel.parameters);
//             parameter.name = 'parameter';
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function (parameter) {' + os.EOL +
//                 '}'
//             );
//         });
//
//         it('should include any Interactions of the Action:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var method = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var plugin = {
//                 methods: [method],
//                 name: 'plugin',
//                 variableName: 'plugin'
//             };
//             var pageObject = {
//                 plugins: [plugin],
//                 variableName: 'PageObject'
//             };
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             actionModel.addInteraction();
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function () {' + os.EOL +
//                 '    var self = this;' + os.EOL +
//                 '    return plugin.method();' + os.EOL +
//                 '}'
//             );
//         });
//
//         it('should include Interactions using any Element:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var elementMethod = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var element = {
//                 methods: [elementMethod],
//                 name: 'element',
//                 variableName: 'element'
//             };
//             var pluginMethod = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var plugin = {
//                 methods: [pluginMethod],
//                 name: 'plugin',
//                 variableName: 'plugin'
//             };
//             var pageObject = {
//                 domElements: [element],
//                 elements: [plugin, element],
//                 plugins: [plugin],
//                 variableName: 'PageObject'
//             };
//             element.pageObject = pageObject;
//
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             actionModel.addInteraction();
//             var interaction = _.first(actionModel.interactions);
//             interaction.element = element;
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function () {' + os.EOL +
//                 '    var self = this;' + os.EOL +
//                 '    return self.element.method();' + os.EOL +
//                 '}'
//             );
//         });
//
//         it('should include Interactions that return promises:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var elementMethod = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var element = {
//                 methods: [elementMethod],
//                 name: 'element',
//                 variableName: 'element'
//             };
//             var pluginMethod = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var plugin = {
//                 methods: [pluginMethod],
//                 name: 'plugin',
//                 variableName: 'plugin'
//             };
//             var pageObject = {
//                 domElements: [element],
//                 elements: [plugin, element],
//                 plugins: [plugin],
//                 variableName: 'PageObject'
//             };
//             element.pageObject = pageObject;
//
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             actionModel.addInteraction();
//             var interactionOne = _.first(actionModel.interactions);
//             interactionOne.element = element;
//             actionModel.addInteraction();
//             var interactionTwo = _.last(actionModel.interactions);
//             interactionTwo.element = element;
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function () {' + os.EOL +
//                 '    var self = this;' + os.EOL +
//                 '    return self.element.method().then(function () {' + os.EOL +
//                 '        return self.element.method();' + os.EOL +
//                 '    });' + os.EOL +
//                 '}'
//             );
//         });
//
//         it('should include Interactions that don\'t return promises:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var elementMethod = {
//                 name: 'method',
//                 returns: 'string'
//             };
//             var element = {
//                 methods: [elementMethod],
//                 name: 'element',
//                 variableName: 'element'
//             };
//             var pluginMethod = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var plugin = {
//                 methods: [pluginMethod],
//                 name: 'plugin',
//                 variableName: 'plugin'
//             };
//             var pageObject = {
//                 domElements: [element],
//                 elements: [plugin, element],
//                 plugins: [plugin],
//                 variableName: 'PageObject'
//             };
//             element.pageObject = pageObject;
//
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             actionModel.addInteraction();
//             var interactionOne = _.first(actionModel.interactions);
//             interactionOne.element = element;
//             actionModel.addInteraction();
//             var interactionTwo = _.last(actionModel.interactions);
//             interactionTwo.element = element;
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function () {' + os.EOL +
//                 '    var self = this;' + os.EOL +
//                 '    return new Promise(function (resolve) {' + os.EOL +
//                 '        resolve(self.element.method());' + os.EOL +
//                 '    }).then(function () {' + os.EOL +
//                 '        return new Promise(function (resolve) {' + os.EOL +
//                 '            resolve(self.element.method());' + os.EOL +
//                 '        });' + os.EOL +
//                 '    });' + os.EOL +
//                 '}'
//             );
//         });
//
//         it('should include Interactions that return values:', function () {
//             var escodegen = require('escodegen');
//             var os = require('os');
//
//             var elementMethod = {
//                 name: 'method',
//                 returns: 'promise',
//                 promise: {
//                     name: 'resultValue'
//                 }
//             };
//             var element = {
//                 methods: [elementMethod],
//                 name: 'element',
//                 variableName: 'element'
//             };
//             var pluginMethod = {
//                 name: 'method',
//                 returns: 'promise'
//             };
//             var plugin = {
//                 methods: [pluginMethod],
//                 name: 'plugin',
//                 variableName: 'plugin'
//             };
//             var pageObject = {
//                 domElements: [element],
//                 elements: [plugin, element],
//                 plugins: [plugin],
//                 variableName: 'PageObject'
//             };
//             element.pageObject = pageObject;
//
//             var actionModel = new ActionModel(pageObject);
//             actionModel.name = 'Action';
//             actionModel.addInteraction();
//             var interactionOne = _.first(actionModel.interactions);
//             interactionOne.element = element;
//             actionModel.addInteraction();
//             var interactionTwo = _.last(actionModel.interactions);
//             interactionTwo.element = element;
//             var ast = actionModel.ast;
//
//             expect(escodegen.generate(ast)).to.equal(
//                 'PageObject.prototype.action = function () {' + os.EOL +
//                 '    var self = this;' + os.EOL +
//                 '    return self.element.method().then(function (resultValue) {' + os.EOL +
//                 '        return self.element.method();' + os.EOL +
//                 '    });' + os.EOL +
//                 '}'
//             );
//         });
//     });
//
//     describe('ActionModel.addParameter:', function () {
//         it('should add a new Parameter to the Action:', function () {
//             var actionModel = new ActionModel();
//             actionModel.addParameter();
//
//             expect(actionModel.parameters.length).to.equal(1);
//             var parameter = _.first(actionModel.parameters);
//             expect(parameter).to.be.an.instanceof(ParameterModel);
//         });
//     });
//
//     describe('ActionModel.removeParameter:', function () {
//         it('should remove a Parameter from the Action:', function () {
//             var actionModel = new ActionModel();
//             actionModel.addParameter();
//
//             var parameter = _.first(actionModel.parameters);
//             actionModel.removeParameter(parameter);
//             expect(actionModel.parameters.length).to.equal(0);
//         });
//     });
//
//     describe('ActionModel.addInteraction:', function () {
//         it('should add a new Interaction to the Action:', function () {
//             var plugin = {
//                 methods: [{}]
//             };
//             var pageObject = {
//                 plugins: [plugin]
//             };
//             var actionModel = new ActionModel(pageObject);
//             actionModel.addInteraction();
//
//             expect(actionModel.interactions.length).to.equal(1);
//             var interaction = _.first(actionModel.interactions);
//             expect(interaction).to.be.an.instanceof(InteractionModel);
//         });
//
//         it('should set the default element of the Interaction to be the first plugin:', function () {
//             var plugin = {
//                 methods: [{}]
//             };
//             var pageObject = {
//                 plugins: [plugin]
//             };
//             var actionModel = new ActionModel(pageObject);
//             actionModel.addInteraction();
//
//             expect(actionModel.interactions.length).to.equal(1);
//             var interaction = _.first(actionModel.interactions);
//             expect(interaction.element).to.equal(plugin);
//         });
//     });
//
//     describe('ActionModel.removeInteraction:', function () {
//         it('should remove a Interaction from the Action:', function () {
//             var plugin = {
//                 methods: [{}]
//             };
//             var pageObject = {
//                 plugins: [plugin]
//             };
//             var actionModel = new ActionModel(pageObject);
//             actionModel.addInteraction();
//
//             var interaction = _.first(actionModel.interactions);
//             actionModel.removeInteraction(interaction);
//             expect(actionModel.interactions.length).to.equal(0);
//         });
//     });
//
//     describe('ActionModel.getAllVariableNames:', function () {
//         it('should return all the variables associated with this Action\'s PageObject:', function () {
//             var pageObject = new PageObjectModel();
//             var allVariableNames = [];
//
//             var actionModel = new ActionModel(pageObject);
//
//             sinon.stub(pageObject, 'getAllVariableNames').returns(allVariableNames);
//
//             expect(actionModel.getAllVariableNames()).to.equal(allVariableNames);
//         });
//     });
// });
