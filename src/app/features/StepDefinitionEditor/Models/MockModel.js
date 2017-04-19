'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./HeaderModel');

var createMockModelConstructor = function (
    astCreatorService,
    HeaderModel
) {
    var MockModel = function MockModel (step) {
        var headers = [];

        Object.defineProperties(this, {
            headers: {
                get: function () {
                    return headers;
                }
            },
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
        this.status = 200;
    };

    MockModel.prototype.actions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

    MockModel.prototype.addHeader = function () {
        this.headers.push(new HeaderModel(this));
    };

    MockModel.prototype.removeHeader = function (toRemove) {
        _.remove(this.headers, function (header) {
            return header === toRemove;
        });
    };

    return MockModel;

    function toAST () {
        var ast = astCreatorService;

        var data = {
            //The RegExp constructor does not escape special characters, so we need to double-escape "\?" to "\\\?" in the string before creating the RegExp.
            url: ast.literal(new RegExp(this.url.replace(/\?/g,'\\\?')))
        };
        var template = 'mockRequests.when' + this.action + '(%= url %, {';
        if (this.passThrough) {
            template += 'passThrough: true';
        } else {
            template += 'body: <%= dataName %>,';
            data.dataName = ast.identifier(this.data.variableName);

            if (this.status) {
                data.status = ast.literal(+this.status);
                template += 'status: <%= status %>,';
            }

            if (this.headers.length) {
                template += 'headers: {';
                this.headers.map(function (header) {
                    template += header.ast + ',';
                });
                template += '}';
            }
        }
        template += '});'

        return ast.template(template, data).expression;
    }
};

StepDefinitionEditor.factory('MockModel', function (
    astCreatorService,
    HeaderModel
) {
    return createMockModelConstructor(astCreatorService, HeaderModel);
});
