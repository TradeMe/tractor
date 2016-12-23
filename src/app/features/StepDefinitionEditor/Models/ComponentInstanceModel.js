'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
var camel = require('change-case').camel;
var pascal = require('change-case').pascal;
require('../../../Core/Services/ASTCreatorService');

var createComponentInstanceModelConstructor = function (
    astCreatorService
) {
    var ComponentInstanceModel = function ComponentInstanceModel (component, stepDefinition) {
        Object.defineProperties(this, {
            stepDefinition: {
                get: function () {
                    return stepDefinition;
                }
            },
            component: {
                get: function () {
                    return component;
                }
            },
            name: {
                get: function () {
                    return this.component.name;
                }
            },
            constructorName: {
                get: function () {
                    return pascal(this.name);
                }
            },
            variableName: {
                get: function () {
                    return camel(this.name);
                }
            },
            actions: {
                get: function () {
                    return actions;
                }
            },
            meta: {
                get: function () {
                    return {
                        name: this.name
                    };
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });
    };

    return ComponentInstanceModel;

    function toAST () {
        var ast = astCreatorService;

        var template = 'var <%= constructor %> = require(<%= path %>), ';
        template += '<%= name %> = new <%= constructor %>(); ';

        var relativePath = getRelativePath.call(this);

        return ast.template(template, {
            constructor: ast.identifier(this.constructorName),
            path: ast.literal(relativePath),
            name: ast.identifier(this.variableName)
        });
    }

    function getRelativePath () {
        var relativePath = path.relative(path.dirname(this.stepDefinition.url), this.component.url);
        return relativePath;
    }
};

StepDefinitionEditor.factory('ComponentInstanceModel', function (
    astCreatorService
) {
    return createComponentInstanceModelConstructor(astCreatorService);
});
