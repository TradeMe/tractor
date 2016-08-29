'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./MethodModel');

var createInteractionModelConstructor = function (
    astCreatorService,
    MethodModel
) {
    var ast = astCreatorService;

    var InteractionModel = function InteractionModel (action) {
        var element;
        var method;
        var methodInstance;

        Object.defineProperties(this, {
            action: {
                get: function () {
                    return action;
                }
            },
            element: {
                get: function () {
                    return element;
                },
                set: function (newElement) {
                    element = newElement;
                    this.method = _.first(element.methods);
                }
            },
            method: {
                get: function () {
                    return method;
                },
                set: function (newMethod) {
                    method = newMethod;
                    methodInstance = new MethodModel(this, this.method);
                }
            },
            methodInstance: {
                get: function () {
                    return methodInstance;
                }
            },
            arguments: {
                get: function () {
                    return methodInstance.arguments;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });
    };

    return InteractionModel;

    function toAST () {
        this.resultFunctionExpression = ast.functionExpression();

        var template = '<%= interaction %>';
        if (this.methodInstance.returns !== 'promise') {
            template = 'new Promise(function (resolve) { resolve(' + template + '); });';
        }

        var interaction = interactionAST.call(this);

        return ast.expression(template, {
            interaction: interaction
        });
    }

    function interactionAST () {
        var template = '<%= element %>';
        if (this.element.variableName !== 'browser') {
            template = 'self.' + template;
        }
        template += '.<%= method %>(%= argumentValues %);';

        var element = ast.identifier(this.element.variableName);
        var method = ast.identifier(this.methodInstance.name);
        var argumentValues = _.map(this.methodInstance.arguments, function (argument) {
            return argument.ast;
        });

        return ast.expression(template, {
            element: element,
            method: method,
            argumentValues: argumentValues
        });
    }
};

ComponentEditor.factory('InteractionModel', function (
    astCreatorService,
    MethodModel
) {
    return createInteractionModelConstructor(astCreatorService, MethodModel);
});
