'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as assert from 'assert';

// Dependencies:
import { Action } from '../action/action';
import { ArgumentParserService, ARGUMENT_PARSER_PROVIDERS } from '../argument/parser.service';
import { ASTService, AST_PROVIDERS } from '../../shared/ast/ast.service';
import { Interaction, InteractionFactory, INTERACTION_PROVIDERS } from './interaction';

@Injectable()
export class InteractionParserService {
    constructor (
        private argumentParserService: ArgumentParserService,
        private astService: ASTService,
        private interactionFactory: InteractionFactory
    ) { }

    parse (action: Action, ast): Interaction {
        try {
            let interaction = this.interactionFactory.create(action);

            let { argument } = ast;
            let parseState = { argument };

            let parsers = [this.parseNestedInteraction, this.parseFirstOwnPromiseInteraction, this.parseFirstWrappedPromiseInteraction, this.parseOwnPromiseInteraction, this.parseWrappedPromiseInteraction];
            this.tryParse(action, interaction, parseState, parsers);

            return interaction;
        } catch (e) {
            console.warn('Invalid interaction:', this.astService.toJS(ast));
            return null;
        }
    }

    private tryParse (action: Action, interaction: Interaction, parseState, parsers): void {
        let parsed = parsers.some(parser => {
            try {
                return parser.call(this, action, interaction, parseState);
            } catch (e) {}
        });
        if (!parsed) {
            throw new Error();
        }
    }

    private parseNestedInteraction (action: Action, interaction: Interaction, parseState): void {
        assert(parseState.argument.callee.object.callee);
        this.parse(action, {
            argument: parseState.argument.callee.object
        });
    }

    private parseFirstOwnPromiseInteraction (action: Action, interaction: Interaction, parseState): boolean {
        parseState.expression = parseState.argument;
        assert(!parseState.expression.callee.object.callee);
        this.parseInteraction(action, interaction, parseState);
        return true;
    }

    private parseFirstWrappedPromiseInteraction (action: Action, interaction: Interaction, parseState): boolean {
        let [wrappedThenFunctionExpression] = parseState.argument.arguments;
        let [interactionResolveExpressionStatement] = wrappedThenFunctionExpression.body.body;
        let [expression] = interactionResolveExpressionStatement.expression.arguments;
        parseState.expression = expression;
        this.parseInteraction(action, interaction, parseState);
        return true;
    }

    private parseOwnPromiseInteraction (action: Action, interaction: Interaction, parseState): boolean {
        let [wrappedThenFunctionExpression] = parseState.argument.arguments;
        let [wrappedNewPromiseReturnStatement] = wrappedThenFunctionExpression.body.body;
        let [wrappedResolveFunctionExpression] = wrappedNewPromiseReturnStatement.argument.arguments;
        let [interactionResolveExpressionStatement] = wrappedResolveFunctionExpression.body.body;
        let [expression] = interactionResolveExpressionStatement.expression.arguments;
        parseState.expression = expression;
        this.parseInteraction(action, interaction, parseState);
        return true;
    }

    private parseWrappedPromiseInteraction (action: Action, interaction: Interaction, parseState): boolean {
        let [wrappedThenFunctionExpression] = parseState.argument.arguments;
        let [interactionReturnStatement] = wrappedThenFunctionExpression.body.body;
        parseState.expression = interactionReturnStatement.argument;
        this.parseInteraction(action, interaction, parseState);
        return true;
    }

    private parseInteraction (action: Action, interaction: Interaction, parseState): void {
        if (parseState.expression.callee.object.name === 'browser') {
            interaction.element = action.pageObject.browser;
        } else {
            interaction.element = action.pageObject.elements.find(element => {
                return element.variableName === parseState.expression.callee.object.property.name;
            });
        }
        assert(interaction.element);
        interaction.method = interaction.element.methods.find(elementAction => {
            return elementAction.name === parseState.expression.callee.property.name;
        });
        assert(interaction.method);
        let args = parseState.expression.arguments.map((argument, index) => {
            let arg = this.argumentParserService.parse(interaction.methodInstance, interaction.method.arguments[index], argument);
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
    }
}

export const INTERACTION_PARSER_PROVIDERS = [
    InteractionParserService,
    ARGUMENT_PARSER_PROVIDERS,
    AST_PROVIDERS,
    INTERACTION_PROVIDERS
];
