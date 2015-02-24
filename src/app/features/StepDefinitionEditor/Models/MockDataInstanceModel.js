'use strict';

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var createMockDataInstanceModelConstructor = function (
    ASTCreatorService
) {
    var MockDataInstanceModel = function MockDataInstanceModel (mockData) {
        Object.defineProperties(this, {
            mockData: {
                get: function () {
                    return mockData;
                }
            },
            name: {
                get: function () {
                    return mockData.name.charAt(0).toLowerCase() + mockData.name.slice(1);
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

        var mockDataNameIdentifier = ast.identifier(this.name);
        var requirePathLiteral = ast.literal('../mock_data/' + this.mockData.name + '.mock.json');
        var requireCallExpression = ast.callExpression(ast.identifier('require'), [requirePathLiteral]);
        var importDeclarator = ast.variableDeclarator(mockDataNameIdentifier, requireCallExpression);
        var importDeclaration = ast.variableDeclaration([importDeclarator]);

        return importDeclaration;
    }
};

StepDefinitionEditor.factory('MockDataInstanceModel', function (
    ASTCreatorService
) {
    return createMockDataInstanceModelConstructor(ASTCreatorService);
});
