'use strict';

// Utilities:
var path = require('path');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
var camel = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');

var createMockDataInstanceModelConstructor = function (
    astCreatorService
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
                    return camel(this.name);
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
        var ast = astCreatorService;
        var template = 'var <%= name %> = require(<%= path %>); ';
        var relativePath = getRelativePath.call(this);

        return ast.template(template, {
            name: ast.identifier(this.variableName),
            path: ast.literal(relativePath)
        });
    }

    function getRelativePath () {
        var relativePath = path.relative(path.dirname(this.stepDefinition.url), this.mockData.url);
        return relativePath;
    }
};

StepDefinitionEditor.factory('MockDataInstanceModel', function (
    astCreatorService
) {
    return createMockDataInstanceModelConstructor(astCreatorService);
});
