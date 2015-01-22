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
        var moduleBody = componentModuleExpressionStatement.expression.right.callee.body.body;

        _.each(moduleBody, function (statement, index) {
            var notElement = false;
            var notAction = false;
            var notReturn = false;

            try {
                var constructorDeclarator = _.first(statement.declarations);
                component.name = constructorDeclarator.id.name;
                var constructorBody = constructorDeclarator.init.body.body;
                _.each(constructorBody, function (statement) {
                    var domElement = ElementParserService.parse(component, statement);
                    assert(domElement);
                    component.elements.push(domElement);
                    component.domElements.push(domElement);
                });
            } catch (e) {
                notElement = true;
            }

            try {
                if (notElement) {
                    var action = ActionParserService.parse(component, statement);
                    assert(action);
                    component.actions.push(action);
                }
            } catch (e) {
                notAction = true;
            }

            try {
                if (notAction) {
                    assert(statement.argument.name === component.name);
                }
            } catch (e) {
                notReturn = true;
            }

            if (notElement && notAction && notReturn) {
                console.log(statement, index);
            }
        });
        return component;
    }
};

ComponentEditor.service('ComponentParserService', ComponentParserService);
