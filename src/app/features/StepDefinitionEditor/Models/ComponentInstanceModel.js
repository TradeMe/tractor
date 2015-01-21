'use strict';

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
require('../../../Core/Services/ASTCreatorService');

var ComponentInstanceModel = function (ASTCreatorService) {
    var ast = ASTCreatorService;

    var ComponentInstanceModel = function ComponentInstanceModel (component) {
        Object.defineProperties(this, {
            component: {
                get: function () { return component; }
            },
            name: {
                get: function () { return component.name.charAt(0).toLowerCase() + component.name.slice(1); }
            },
            ast: {
                get: function () { return toAST.call(this); }
            }
        });
    };

    var toAST = function () {
        var requirePathLiteral = ast.createLiteral('../components/' + this.component.name + '.component');
        var requireCallExpression = ast.createCallExpression(ast.createIdentifier('require'), [requirePathLiteral]);
        var importDeclarator = ast.createVariableDeclarator(this.component.nameIdentifier, requireCallExpression);
        var importDeclaration = ast.createVariableDeclaration([importDeclarator]);

        var newComponentNewStatement = ast.createNewExpression(this.component.nameIdentifier);
        var newComponentIdentifier = ast.createIdentifier(this.name);
        var newComponentDeclarator = ast.createVariableDeclarator(newComponentIdentifier, newComponentNewStatement);
        var newComponentDeclaration = ast.createVariableDeclaration([newComponentDeclarator])
        return [importDeclaration, newComponentDeclaration];
    };

    return ComponentInstanceModel;
};

StepDefinitionEditor.factory('ComponentInstanceModel', function (
    ASTCreatorService
) {
    return ComponentInstanceModel(ASTCreatorService);
});
