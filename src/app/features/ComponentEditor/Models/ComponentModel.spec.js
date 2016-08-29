/*global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Utilities:
var _ = require('lodash');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);

// Testing:
require('./ComponentModel');
var ComponentModel;

describe('ComponentModel.js:', function () {
    var ElementModel;
    var FilterModel;
    var ActionModel;
    var InteractionModel;

    beforeEach(function () {
        angular.mock.module('ComponentEditor');

        angular.mock.module(function ($provide) {
            $provide.factory('plugins', function () {
                return [{
                    name: 'browser',
                    variableName: 'browser',
                    methods: [{
                        name: 'get',
                        description: 'Navigate to the given destination and loads mock modules before Angular.',
                        arguments: [{
                            name: 'destination',
                            description: 'Destination URL',
                            type: 'string',
                            required: true
                        }, {
                            name: 'timeout',
                            description: 'Number of milliseconds to wait for Angular to start.',
                            type: 'number'
                        }]
                    }]
                }];
            });
        });

        angular.mock.inject(function (_ComponentModel_, _ElementModel_, _FilterModel_, _ActionModel_, _InteractionModel_) {
            ComponentModel = _ComponentModel_;
            ElementModel = _ElementModel_;
            FilterModel = _FilterModel_;
            ActionModel = _ActionModel_;
            InteractionModel = _InteractionModel_;
        });
    });

    describe('ComponentModel constructor:', function () {
        it('should create a new `ComponentModel`:', function () {
            var componentModel = new ComponentModel();
            expect(componentModel).to.be.an.instanceof(ComponentModel);
        });

        it('should have default properties:', function () {
            var componentModel = new ComponentModel();

            expect(componentModel.elements.length).to.equal(1);
            expect(componentModel.domElements.length).to.equal(0);
            expect(componentModel.actions.length).to.equal(0);
            expect(componentModel.name).to.equal('');
            expect(componentModel.meta).to.equal(JSON.stringify({
                name: '',
                elements: [],
                actions: []
            }));
        });
    });

    describe('ComponentModel.isSaved:', function () {
        it('should be false by default:', function () {
            var componentModel = new ComponentModel();

            expect(componentModel.isSaved).to.be.false();
        });

        it('should get the value from the given `options`:', function () {
            var options = {
                isSaved: true
            };
            var componentModel = new ComponentModel(options);

            expect(componentModel.isSaved).to.be.true();
        });
    });

    describe('ComponentModel.isSaved:', function () {
        it('should get the value from the given `options`:', function () {
            var options = {
                path: 'path'
            };
            var componentModel = new ComponentModel(options);

            expect(componentModel.path).to.equal('path');
        });
    });

    describe('ComponentModel.browser:', function () {
        it('should return the "browser" plugin:', function () {
            var componentModel = new ComponentModel();

            var browser = _.first(componentModel.elements);
            expect(componentModel.browser).to.equal(browser);
            expect(componentModel.browser.name).to.equal('browser');
        });
    });

    describe('ComponentModel.variableName:', function () {
        it('should turn the full name of the Component into a JS variable:', function () {
            var componentModel = new ComponentModel();

            componentModel.name = 'A long name that describes the Component.';
            expect(componentModel.variableName).to.equal('ALongNameThatDescribesTheComponent');
        });
    });

    describe('ComponentModel.meta:', function () {
        it('should contain the full name of the Component:', function () {
            var componentModel = new ComponentModel();

            componentModel.name = 'A long name that describes the Component.';
            expect(JSON.parse(componentModel.meta).name).to.equal('A long name that describes the Component.');
        });

        it('should contain the meta data for the Elements of the Component:', function () {
            var elementMeta = { name: 'element' };
            var element = { meta: elementMeta };

            var componentModel = new ComponentModel();
            componentModel.domElements.push(element);

            expect(_.first(JSON.parse(componentModel.meta).elements)).to.deep.equal(elementMeta);
        });

        it('should contain the meta data for the Actions of the Component:', function () {
            var actionMeta = { name: 'action' };
            var action = { meta: actionMeta };

            var componentModel = new ComponentModel();
            componentModel.actions.push(action);

            expect(_.first(JSON.parse(componentModel.meta).actions)).to.deep.equal(actionMeta);
        });
    });

    describe('ComponentModel.ast:', function () {
        it('should be the AST of the Component:', function () {
            var escodegen = require('escodegen');
            var os = require('os');

            var componentModel = new ComponentModel();
            componentModel.name = 'Component';
            var ast = componentModel.ast;

            expect(escodegen.generate(ast)).to.equal(
                'module.exports = function () {' + os.EOL +
                '    var Component = function Component() {' + os.EOL +
                '    };' + os.EOL +
                '    return Component;' + os.EOL +
                '}();'
            );
        });

        it('should include Elements of the Component:', function () {
            var escodegen = require('escodegen');
            var os = require('os');

            var componentModel = new ComponentModel();
            componentModel.name = 'Component';
            componentModel.addElement();
            var element = _.first(componentModel.domElements);
            element.name = 'element';
            var filter = _.first(element.filters);
            filter.type = 'binding';
            filter.locator = '{{ model.binding }}';
            var ast = componentModel.ast;

            expect(escodegen.generate(ast)).to.equal(
                'module.exports = function () {' + os.EOL +
                '    var Component = function Component() {' + os.EOL +
                '        this.element = element(by.binding(\'{{ model.binding }}\'));' + os.EOL +
                '    };' + os.EOL +
                '    return Component;' + os.EOL +
                '}();'
            );
        });

        it('should include Actions of the Component:', function () {
            var escodegen = require('escodegen');
            var os = require('os');

            var componentModel = new ComponentModel();
            componentModel.name = 'Component';
            componentModel.addAction();
            var action = _.first(componentModel.actions);
            action.name = 'action';
            var ast = componentModel.ast;

            expect(escodegen.generate(ast)).to.equal(
                'module.exports = function () {' + os.EOL +
                '    var Component = function Component() {' + os.EOL +
                '    };' + os.EOL +
                '    Component.prototype.action = function () {' + os.EOL +
                '        var self = this;' + os.EOL +
                '        return new Promise(function (resolve) {' + os.EOL +
                '            resolve(browser.get(null, null));' + os.EOL +
                '        });' + os.EOL +
                '    };' + os.EOL +
                '    return Component;' + os.EOL +
                '}();'
            );
        });
    });

    describe('ComponentModel.data:', function () {
        it('should be an alias for the AST of the Component:', function () {
            var escodegen = require('escodegen');
            var os = require('os');

            var componentModel = new ComponentModel();
            componentModel.name = 'Component';

            expect(componentModel.ast).to.deep.equal(componentModel.data);
        });
    });

    describe('ComponentModel.addElement:', function () {
        it('should add a new Element to the Component:', function () {
            var componentModel = new ComponentModel();
            componentModel.addElement();

            expect(componentModel.elements.length).to.equal(2);
            expect(componentModel.domElements.length).to.equal(1);
            var element = _.first(componentModel.domElements);
            expect(element).to.be.an.instanceof(ElementModel);
        });

        it('should add a new Filter to the new Element:', function () {
            var componentModel = new ComponentModel();
            componentModel.addElement();

            var element = _.first(componentModel.domElements);
            expect(element.filters.length).to.equal(1);
            var filter = _.first(element.filters);
            expect(filter).to.be.an.instanceof(FilterModel);
        });
    });

    describe('ComponentModel.removeElement:', function () {
        it('should remove a Element from the Component:', function () {
            var componentModel = new ComponentModel();
            componentModel.addElement();

            var element = _.first(componentModel.domElements);
            componentModel.removeElement(element);
            expect(componentModel.domElements.length).to.equal(0);
            expect(componentModel.elements.length).to.equal(1);
        });
    });

    describe('ComponentModel.addAction:', function () {
        it('should add a new Action to the Component:', function () {
            var componentModel = new ComponentModel();
            componentModel.addAction();

            expect(componentModel.actions.length).to.equal(1);
            var action = _.first(componentModel.actions);
            expect(action).to.be.an.instanceof(ActionModel);
        });

        it('should add a new Interaction to the new Action:', function () {
            var componentModel = new ComponentModel();
            componentModel.addAction();

            var action = _.first(componentModel.actions);
            expect(action.interactions.length).to.equal(1);
            var interaction = _.first(action.interactions);
            expect(interaction).to.be.an.instanceof(InteractionModel);
        });
    });

    describe('ComponentModel.removeAction:', function () {
        it('should remove a Action from the Component:', function () {
            var componentModel = new ComponentModel();
            componentModel.addAction();

            var action = _.first(componentModel.actions);
            componentModel.removeAction(action);
            expect(componentModel.actions.length).to.equal(0);
        });
    });

    describe('ComponentModel.getAllVariableNames:', function () {
        it('should return all the variables associated with this Component:', function () {
            var componentModel = new ComponentModel();
            componentModel.name = 'Component';
            componentModel.addElement();
            var element = _.first(componentModel.domElements);
            element.name = 'element';
            componentModel.addAction();
            var action = _.first(componentModel.actions);
            action.name = 'action';

            expect(componentModel.getAllVariableNames()).to.deep.equal(['browser', 'element', 'action']);
        });

        it('should exclude the variable name of the given from the list:', function () {
            var componentModel = new ComponentModel();
            componentModel.name = 'component';
            componentModel.addElement();
            var element = _.first(componentModel.domElements);
            element.name = 'element';
            componentModel.addAction();
            var action = _.first(componentModel.actions);
            action.name = 'action';

            expect(componentModel.getAllVariableNames(action)).to.deep.equal(['component', 'browser', 'element']);
        });
    });
});
