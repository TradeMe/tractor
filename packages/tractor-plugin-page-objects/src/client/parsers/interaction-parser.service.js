// Utilities:
import assert from 'assert';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/interaction';
import './argument-parser.service';

function InteractionParserService (
    InteractionModel,
    argumentParserService
) {
    return { parse };

    function parse (action, astObject) {
        let interaction = new InteractionModel(action);

        let notFirstWrappedPromiseInteraction = false;
        let notFirstOwnPromiseInteraction = false;
        let notWrappedPromiseInteraction = false;
        let notOwnPromiseInteraction = false;
        let notValidInteraction = false;

        try {
            assert(astObject.argument.callee.object.callee);
            parse(action, {
                argument: astObject.argument.callee.object
            });
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
                interaction.resultFunctionExpression = wrappedThenFunctionExpression;
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
                interaction.resultFunctionExpression = wrappedThenFunctionExpression;
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
            interaction.method = interaction.element.methods.find(elementAction => {
                return elementAction.name === interactionCallExpression.callee.property.name;
            });
            assert(interaction.method);
            let args = interactionCallExpression.arguments.map((argument, index) => {
                let arg = argumentParserService.parse(interaction.methodInstance, interaction.method.arguments[index], argument);
                assert(arg);
                let parameter = action.parameters.find(parameter => {
                    return parameter.variableName === arg.value;
                });
                if (parameter) {
                    arg.value = parameter.name;
                }
                return arg;
            });
            interaction.methodInstance.arguments = args;
            action.interactions.push(interaction);
        } catch (e) {
            notValidInteraction = true;
        }

        if (notFirstWrappedPromiseInteraction && notFirstOwnPromiseInteraction && notWrappedPromiseInteraction && notOwnPromiseInteraction && notValidInteraction) {
            console.log(astObject);
        }
    }
}

PageObjectsModule.service('interactionParserService', InteractionParserService);
