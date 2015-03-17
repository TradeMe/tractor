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
        try {
            var meta = {};
            try {
                meta = JSON.parse(_.first(astObject.comments).value);
            } catch (e) { }

            var component = new ComponentModel();
            component.name = meta.name;

            var componentModuleExpressionStatement = _.first(astObject.body);
            var moduleBlockStatement = componentModuleExpressionStatement.expression.right.callee.body;

            _.each(moduleBlockStatement.body, function (statement, index) {
                try {
                    assert(statement.argument.name);
                    return;
                } catch (e) { }

                try {
                    var constructorDeclarator = _.first(statement.declarations);
                    var constructorBlockStatement = constructorDeclarator.init.body;
                    _.each(constructorBlockStatement.body, function (statement) {
                        var domElement = ElementParserService.parse(component, statement);
                        assert(domElement);
                        domElement.name = meta.elements[component.domElements.length].name;
                        component.elements.push(domElement);
                        component.domElements.push(domElement);
                    });
                    return;
                } catch (e) { }

                try {
                    var actionMeta = meta.actions[component.actions.length];
                    var action = ActionParserService.parse(component, statement, actionMeta);
                    assert(action);
                    action.name = actionMeta.name;
                    component.actions.push(action);
                    return;
                } catch (e) { }

                console.warn('Invalid Component:', statement, index);
            });

            return component;
        } catch (e) {
            return new ComponentModel();
        }
    }
};

ComponentEditor.service('ComponentParserService', ComponentParserService);
