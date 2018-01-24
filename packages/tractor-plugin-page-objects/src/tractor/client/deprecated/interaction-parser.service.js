// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import assert from 'assert';
import '../parsers/action-argument-parser.service';
import '../models/interaction';

function DeprecatedInteractionParserService (
    InteractionModel,
    actionArgumentParserService
) {
    return { parse };

    function parse (action, astObject, previousInteraction) {
        let interaction = new InteractionModel(action);
        if (previousInteraction) {
            previousInteraction.lastInteraction = interaction;
        }

        let notFirstWrappedPromiseInteraction = false;
        let notFirstOwnPromiseInteraction = false;
        let notWrappedPromiseInteraction = false;
        let notOwnPromiseInteraction = false;
        let notValidInteraction = false;

        try {
            assert(astObject.argument.callee.object.callee);
            parse(action, {
                argument: astObject.argument.callee.object
            }, interaction);
        // eslint-disable-next-line no-empty
        } catch (e) { }

        let interactionCallExpression;

        try {
            let [wrappedThenFunctionExpression] = astObject.argument.arguments;
            let [interactionResolveExpressionStatement] = wrappedThenFunctionExpression.body.body;
            [interactionCallExpression] = interactionResolveExpressionStatement.expression.arguments;
        } catch (e) {
            notFirstWrappedPromiseInteraction = true;
        }

        try {
            if (notFirstWrappedPromiseInteraction) {
                interactionCallExpression = astObject.argument;
                assert(!interactionCallExpression.callee.object.callee);
            }
        } catch (e) {
            notFirstOwnPromiseInteraction = true;
        }

        try {
            if (notFirstOwnPromiseInteraction) {
                let [wrappedThenFunctionExpression] = astObject.argument.arguments;
                let [wrappedNewPromiseReturnStatement] = wrappedThenFunctionExpression.body.body;
                let [wrappedResolveFunctionExpression] = wrappedNewPromiseReturnStatement.argument.arguments;
                let [interactionResolveExpressionStatement] = wrappedResolveFunctionExpression.body.body;
                [interactionCallExpression] = interactionResolveExpressionStatement.expression.arguments;
            }
        } catch (e) {
            notWrappedPromiseInteraction = true;
        }

        try {
            if (notWrappedPromiseInteraction) {
                let [wrappedThenFunctionExpression] = astObject.argument.arguments;
                let [interactionReturnStatement] = wrappedThenFunctionExpression.body.body;
                interactionCallExpression = interactionReturnStatement.argument;
            }
        } catch (e) {
            notOwnPromiseInteraction = true;
        }

        try {
            let pluginElement = action.pageObject.elements.find(element => {
                return element.variableName === interactionCallExpression.callee.object.name;
            });
            interaction.element = pluginElement || action.pageObject.elements.find(element => {
                return element.variableName === interactionCallExpression.callee.object.property.name;
            });
            assert(interaction.element);
            interaction.action = interaction.element.actions.find(elementAction => {
                return elementAction.variableName === interactionCallExpression.callee.property.name;
            });
            assert(interaction.action);
            let args = interactionCallExpression.arguments.map((argument, index) => {
                let arg = actionArgumentParserService.parse(interaction, interaction.action.parameters[index], argument);
                assert(arg);
                return arg;
            });
            interaction.actionInstance.arguments = args;
            action.interactions.push(interaction);
        } catch (e) {
            notValidInteraction = true;
        }

        if (notFirstWrappedPromiseInteraction && notFirstOwnPromiseInteraction && notWrappedPromiseInteraction && notOwnPromiseInteraction && notValidInteraction) {
            interaction.unparseable = astObject;
        }
    }
}

PageObjectsModule.service('deprecatedInteractionParserService', DeprecatedInteractionParserService);
