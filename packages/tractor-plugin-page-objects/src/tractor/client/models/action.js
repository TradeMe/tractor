// Utilities:
import camelcase from 'camel-case';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import './interaction';
import './parameter';

function createActionModelConstructor (
    InteractionModel,
    ParameterModel,
    astCreatorService
) {
    let ast = astCreatorService;

    let ActionModel = function ActionModel (pageObject) {
        let interactions = [];
        let parameters = [];

        Object.defineProperties(this, {
            pageObject: {
                get () {
                    return pageObject;
                }
            },
            interactions: {
                get () {
                    return interactions;
                }
            },
            parameters: {
                get () {
                    return parameters;
                }
            },
            variableName: {
                get () {
                    return camelcase(this.name);
                }
            },
            meta: {
                get () {
                    return {
                        name: this.name,
                        parameters: this.parameters.map(parameter => parameter.meta)
                    };
                }
            },
            ast: {
                get () {
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
        if (this.parameters.includes(toRemove)) {
            this.parameters.splice(this.parameters.indexOf(toRemove), 1);
        }
    };

    ActionModel.prototype.addInteraction = function () {
        let interaction = new InteractionModel(this);
        interaction.element = this.pageObject.plugins.find(plugin => plugin.name === 'Browser');
        this.interactions.push(interaction);
    };

    ActionModel.prototype.removeInteraction = function (toRemove) {
        if (this.interactions.includes(toRemove)) {
            this.interactions.splice(this.interactions.indexOf(toRemove), 1);
        }
    };

    ActionModel.prototype.getAllVariableNames = function () {
        return this.pageObject.getAllVariableNames(this);
    };

    return ActionModel;

    function toAST () {
        let pageObject = ast.identifier(this.pageObject.variableName);
        let action = ast.identifier(this.variableName);
        let parameters = this.parameters.map(parameter => parameter.ast);
        let interactions = interactionsAST.call(this);

        let template = '<%= pageObject %>.prototype.<%= action %> = function (%= parameters %) {';
        if (interactions) {
            template += 'var self = this;';
            template += 'return <%= interactions %>;';
        }
        template += '};';

        return ast.expression(template, {
            pageObject,
            action,
            parameters,
            interactions
        });
    }

    function interactionsAST () {
        let template = '';
        let fragments = {};
        this.interactions.reduce((previousInteraction, interaction, index) => {
            let interactionTemplate = '<%= interaction' + index + ' %>';

            if (!template.length) {
                template += interactionTemplate;
            } else {
                template += '.then(function (%= parameter' + index + '%) {';
                template += '    return ' + interactionTemplate + ';';
                template += '})';
            }

            fragments['interaction' + index] = interaction.ast;
            fragments['parameter' + index] = [];

            let previousResult = previousInteractionResult(previousInteraction);
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
}

PageObjectsModule.factory('ActionModel', createActionModelConstructor);
