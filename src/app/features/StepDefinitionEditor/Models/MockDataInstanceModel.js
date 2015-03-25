'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
var camel = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');

var createMockDataInstanceModelConstructor = function (
    ASTCreatorService
) {
    var MockDataInstanceModel = function MockDataInstanceModel (mockData, stepDefinition) {
        Object.defineProperties(this, {
            stepDefinition: {
                get: function () {
                    return stepDefinition;
                }
            },
            mockData: {
                get: function () {
                    return mockData;
                }
            },
            name: {
                get: function () {
                    return this.mockData.name;
                }
            },
            variableName: {
                get: function () {
                    return camel(this.mockData.name);
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

    return MockDataInstanceModel;

    function toAST () {
        var ast = ASTCreatorService;

        var template = 'var <%= name %> = require(<%= path %>); ';

        return ast.template(template, {
            name: ast.identifier(this.variableName),
            path: ast.literal(path.relative(this.stepDefinition.path, this.mockData.path))
        });
    }
};

StepDefinitionEditor.factory('MockDataInstanceModel', function (
    ASTCreatorService
) {
    return createMockDataInstanceModelConstructor(ASTCreatorService);
});
