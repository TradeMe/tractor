'use strict';

// Utilities:
var _ = require('lodash');
var assert = require('assert');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('./ParameterParserService');
require('./InteractionParserService');
require('../Models/ActionModel');

var ActionParserService = function ActionParserService (
    ParameterParserService,
    InteractionParserService,
    ActionModel
) {
    return {
        parse: parse
    };

    function parse (component, astObject) {
        var action = new ActionModel(component);

        action.name = astObject.expression.left.property.name;
        var actionFunctionExpression = astObject.expression.right;
        var actionBody = actionFunctionExpression.body.body;

        _.each(actionFunctionExpression.params, function (param) {
            var parameter = ParameterParserService.parse(action, param);
            assert(parameter);
            action.parameters.push(parameter);
        });

        _.each(actionBody, function (statement, index) {
            var notSelf = false;
            var notInteraction = false;

            try {
                var selfVariableDeclarator = _.first(statement.declarations);
                assert(selfVariableDeclarator.id.name === 'self');
            } catch (e) { notSelf = true; }

            try {
                if (notSelf) {
                    InteractionParserService.parse(action, statement);
                }
            } catch (e) { notInteraction = true; }

            if (notSelf && notInteraction) {
                console.log(statement, index);
            }
        });

        return action;
    }
};

ComponentEditor.service('ActionParserService', ActionParserService);
