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
            },
            path: {
                get: function () {
                    var relativePath = getRelativePath.call(this);
                    return relativePath.replace(/\.\.\//g,'').replace(/mock\-data\//, '').replace(/\.mock\.json$/, '');  //replace all ../ and mock-data from the relativePath to get directory path for mockData
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
        // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
        var stepDefinitionPath = this.stepDefinition.path.replace(/\\/g, '/');
        var mockDataPath = this.mockData.path.replace(/\\/g, '/');
        var relativePath = path.relative(path.dirname(stepDefinitionPath), mockDataPath);
        return relativePath;
    }
    
};

StepDefinitionEditor.factory('MockDataInstanceModel', function (
    astCreatorService
) {
    return createMockDataInstanceModelConstructor(astCreatorService);
});
