'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../Services/ElementParserService');
require('../Services/ActionParserService');
require('../Models/ComponentModel');

var ComponentParserService = function ComponentParserService (
    ElementParserService,
    ActionParserService,
    ComponentModel
) {
    return {
        parse: parse
    };

    function parse (astObject) {
        var component = new ComponentModel();

        var componentModuleExpressionStatement = _.first(astObject.body);
        var moduleBlockStatement = componentModuleExpressionStatement.expression.right.callee.body;

        _.each(moduleBlockStatement.body, function (statement, index) {
            try {
                component.name = statement.argument.name;
                return;
            } catch (e) { }

            try {
                var constructorDeclarator = _.first(statement.declarations);
                var constructorBlockStatament = constructorDeclarator.init.body;
                _.each(constructorBlockStatament.body, function (statement) {
                    var domElement = ElementParserService.parse(component, statement);
                    assert(domElement);
                    component.elements.push(domElement);
                    component.domElements.push(domElement);
                });
                return;
            } catch (e) { }

            try {
                var action = ActionParserService.parse(component, statement);
                assert(action);
                component.actions.push(action);
                return;
            } catch (e) { }

            console.warn('Invalid Component:', statement, index);
        });

        return component;
    }
};

ComponentEditor.service('ComponentParserService', ComponentParserService);
