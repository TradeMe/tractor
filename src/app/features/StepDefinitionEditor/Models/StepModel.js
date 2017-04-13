'use strict';

// Utilities;
var _ = require('lodash');

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('./ExpectationModel');
require('./TaskModel');
require('./MockModel');

var createStepModelConstructor = function (
    astCreatorService,
    ExpectationModel,
    TaskModel,
    MockModel
) {
    var StepModel = function StepModel (stepDefinition) {
        var expectations = [];
        var tasks = [];
        var mocks = [];

        Object.defineProperties(this, {
            stepDefinition: {
                get: function () {
                    return stepDefinition;
                }
            },
            expectations: {
                get: function () {
                    return expectations;
                }
            },
            tasks: {
                get: function () {
                    return tasks;
                }
            },
            mocks: {
                get: function () {
                    return mocks;
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });
    };

    StepModel.prototype.stepTypes = ['Given', 'When', 'Then', 'And', 'But'];

    StepModel.prototype.addExpectation = function () {
        this.expectations.push(new ExpectationModel(this));
    };

    StepModel.prototype.removeExpectation = function (toRemove) {
        _.remove(this.expectations, function (expectation) {
            return expectation === toRemove;
        });
    };

    StepModel.prototype.addTask = function () {
        this.tasks.push(new TaskModel(this));
    };

    StepModel.prototype.removeTask = function (toRemove) {
        _.remove(this.tasks, function (task) {
            return task === toRemove;
        });
    };

    StepModel.prototype.addMock = function () {
        this.mocks.push(new MockModel(this));
    };

    StepModel.prototype.removeMock = function (toRemove) {
        _.remove(this.mocks, function (mock) {
            return mock === toRemove;
        });
    };

    return StepModel;

    function toAST () {
        var ast = astCreatorService;

        var expectations = this.expectations.map(function (expectation) {
            return expectation.ast;
        });

        var mocks = this.mocks.map(function (mock) {
            return mock.ast;
        });

        var tasks = this.tasks.map(function (task) {
            return task.ast;
        });

        var template = 'this.<%= type %>(<%= regex %>, function (done) { ';
        if (mocks.length) {
            template += 'Promise.all([%= mocks %]).spread(function () { done(); }).catch(done.fail);';
        } else if (tasks.length) {
            template += 'var tasks = <%= tasks[0] %>';
            tasks.slice(1).forEach(function (taskAST, index) {
                template += '.then(function () { return <%= tasks[' + (index + 1) + '] %>; })';
            });
            template += ';';
            template += 'Promise.resolve(tasks).then(done).catch(done.fail);';
        } else if (expectations.length) {
            template += 'Promise.all([%= expectations %]).spread(function () { done(); }).catch(done.fail);';
        } else {
            template += 'done(null, \'pending\');';
        }
        template += '});';

        return ast.template(template, {
            type: ast.identifier(this.type),
            regex: ast.literal(this.regex),
            mocks: mocks,
            tasks: tasks,
            expectations: expectations
        });
    }
};

StepDefinitionEditor.factory('StepModel', function (
    astCreatorService,
    ExpectationModel,
    TaskModel,
    MockModel
) {
    return createStepModelConstructor(astCreatorService, ExpectationModel, TaskModel, MockModel);
});
