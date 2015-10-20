'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../../Core/Services/ASTCreatorService');
require('./ParameterModel');
require('./InteractionModel');

var createActionModelConstructor = function (
    astCreatorService,
    ParameterModel,
    InteractionModel
) {
    var ast = astCreatorService;

    var ActionModel = function ActionModel (component) {
        var interactions = [];
        var parameters = [];

        Object.defineProperties(this, {
            component: {
                get: function () {
                    return component;
                }
            },
            interactions: {
                get: function () {
                    return interactions;
                }
            },
            parameters: {
                get: function () {
                    return parameters;
                }
            },
            variableName: {
                get: function () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get: function () {
                    return {
                        name: this.name,
                        parameters: this.parameters.map(function (parameter) {
                            return parameter.meta;
                        })
                    };
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.name = '';
    };

    ActionModel.prototype.addParameter = function () {
        this.parameters.push(new ParameterModel(this));
    };

    ActionModel.prototype.removeParameter = function (toRemove) {
        _.remove(this.parameters, function (parameter) {
            return parameter === toRemove;
        });
    };

    ActionModel.prototype.addInteraction = function () {
        var interaction = new InteractionModel(this);
        interaction.element = this.component.browser;
        this.interactions.push(interaction);
    };

    ActionModel.prototype.removeInteraction = function (toRemove) {
        _.remove(this.interactions, function (interaction) {
            return interaction === toRemove;
        });
    };

    ActionModel.prototype.getAllVariableNames = function () {
        return this.component.getAllVariableNames(this);
    };

    return ActionModel;

    function toAST () {
        var component = ast.identifier(this.component.variableName);
        var action = ast.identifier(this.variableName);
        var parameters = _.map(this.parameters, function (parameter) {
            return parameter.ast;
        });
        var interactions = interactionsAST.call(this);

        var template = '<%= component %>.prototype.<%= action %> = function (%= parameters %) {';
        if (interactions) {
            template += 'var self = this;';
            template += 'return <%= interactions %>;';
        }
        template += '};';

        return ast.expression(template, {
            component: component,
            action: action,
            parameters: parameters,
            interactions: interactions
        });
    }

    function interactionsAST () {
        var template = '';
        var fragments = {};
        _.reduce(this.interactions, function (previousInteraction, interaction, index) {
            var interactionTemplate = '<%= interaction' + index + ' %>';

            if (!template.length) {
                template += interactionTemplate;
            } else {
                template += '.then(function (%= parameter' + index + '%) {';
                template += '    return ' + interactionTemplate + ';';
                template += '})';
            }

            fragments['interaction' + index] = interaction.ast;
            fragments['parameter' + index] = [];

            var previousResult = previousInteractionResult(previousInteraction);
            if (previousResult) {
                fragments['parameter' + index].push(ast.identifier(previousResult));
            }

            return interaction;
        }, {});

        return ast.expression(template, fragments);
    }

    function previousInteractionResult (previous) {
        var returns = previous && previous.method && previous.method.returns;
        if (returns && previous.method[returns]) {
            return previous.method[returns].name;
        }
    }
};

ComponentEditor.factory('ActionModel', function (
    astCreatorService,
    ParameterModel,
    InteractionModel
) {
    return createActionModelConstructor(astCreatorService, ParameterModel, InteractionModel);
});
