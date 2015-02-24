'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/ConfigService');

var createBrowserGetTaskModelConstructor = function (
    ASTCreatorService,
    ConfigService
) {
    var BrowserGetTaskModel = function BrowserGetTaskModel () {
        Object.defineProperties(this, {
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        ConfigService.getConfig()
        .then(_.bind(function (config) {
            this.appRootUrl = config.appRootUrl;
        }, this));
    };

    return BrowserGetTaskModel;

    function toAST () {
        var ast = ASTCreatorService;

        var browserGetTaskMemberExpression = ast.memberExpression(ast.identifier('browser'), ast.identifier('get'));
        var browserGetTaskCallExpression = ast.callExpression(browserGetTaskMemberExpression, [ast.literal(this.appRootUrl)]);
        return ast.expressionStatement(browserGetTaskCallExpression);
    }
};

StepDefinitionEditor.factory('BrowserGetTaskModel', function (
    ASTCreatorService,
    ConfigService
) {
    return createBrowserGetTaskModelConstructor(ASTCreatorService, ConfigService);
});
