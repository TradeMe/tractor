'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');

var createMockModelConstructor = function (
    astCreatorService
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
        var ast = astCreatorService;

        var data = {
            url: ast.literal(new RegExp(this.url.replace(/\?/g,'\\\?')))
        };
        var template = 'httpBackend.when' + this.action + '(%= url %)';
        if (this.passThrough) {
            template += '.passThrough(); ';
        } else {
            template += '.respond(%= dataName %); ';
            data.dataName = ast.identifier(this.data.variableName);
        }

        return ast.template(template, data);
    }
};

StepDefinitionEditor.factory('MockModel', function (
    astCreatorService
) {
    return createMockModelConstructor(astCreatorService);
});
