'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var createMockModelConstructor = function (
    ASTCreatorService
) {
    var MockModel = function MockModel (step) {
        Object.defineProperties(this, {
            step: {
                get: function () {
                    return step;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.url = '';
        this.action = _.first(this.actions);
        this.data = _.first(this.step.stepDefinition.mockDataInstances);
        this.passThrough = false;
    };

    MockModel.prototype.actions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

    return MockModel;

    function toAST () {
        var ast = ASTCreatorService;

        var template = 'httpBackend.onLoad.when(%= action %, %= url %)';
        if (this.passThrough) {
            template += '.passThrough(); ';
        } else {
            template += '.respond(%= dataName %); ';
        }

        return ast.template(template, {
            action: ast.literal(this.action),
            url: ast.literal(this.url),
            dataName: ast.identifier(this.data.variableName)
        });
    }
};

StepDefinitionEditor.factory('MockModel', function (
    ASTCreatorService
) {
    return createMockModelConstructor(ASTCreatorService);
});
