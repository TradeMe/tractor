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
        var ast = astCreatorService;

        var template = 'var <%= name %> = require(<%= path %>); ';

        // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
        var stepDefinitionPath = this.stepDefinition.path.replace(/\\/g, '/');
        var mockDataPath = this.mockData.path.replace(/\\/g, '/');
        var relativePath = path.relative(path.dirname(stepDefinitionPath), mockDataPath);

        return ast.template(template, {
            name: ast.identifier(this.variableName),
            path: ast.literal(relativePath)
        });
    }
};

StepDefinitionEditor.factory('MockDataInstanceModel', function (
    astCreatorService
) {
    return createMockDataInstanceModelConstructor(astCreatorService);
});
