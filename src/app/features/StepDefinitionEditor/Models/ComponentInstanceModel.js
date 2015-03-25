'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
var camel = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');

var createComponentInstanceModelConstructor = function (
    ASTCreatorService
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
            variableName: {
                get: function () {
                    return camel(this.component.name);
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
        var ast = ASTCreatorService;

        var template = 'var <%= constructor %> = require(<%= path %>); ';
        template += 'var <%= name %> = new <%= constructor %>(); ';

        return ast.template(template, {
            constructor: ast.identifier(this.component.variableName),
            path: ast.literal(path.relative(this.stepDefinition.path, this.component.path)),
            name: ast.identifier(this.component.name)
        });
    }
};

StepDefinitionEditor.factory('ComponentInstanceModel', function (ASTCreatorService) {
    return createComponentInstanceModelConstructor(ASTCreatorService);
});
