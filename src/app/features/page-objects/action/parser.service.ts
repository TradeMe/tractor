'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Action, ActionFactory } from './action';
import { ASTService } from '../../../shared/ast/ast.service';
import { InteractionParserService } from '../interaction/parser.service';
import { PageObject } from '../page-object/page-object';
import { ParameterParserService } from '../parameter/parser.service';
import { Parser } from '../../../shared/parser/parser.interface';

@Injectable()
export class ActionParserService implements Parser<Action> {
    constructor (
        private actionFactory: ActionFactory,
        private astService: ASTService,
        private interactionParserService: InteractionParserService,
        private parameterParserService: ParameterParserService
    ) { }

    public parse (pageObject: PageObject, ast, meta): Action {
        try {
            let action = this.actionFactory.create(pageObject);

            let { params } = ast.expression.right;
            this.parseParameters(action, params, meta);

            let statements = ast.expression.right.body.body;
            let parsers = [this.parseSelfThis, this.parseInteraction];
            this.tryParse(action, statements, parsers);

            return action;
        } catch (e) {
            console.warn('Invalid action:', this.astService.toJS(ast));
            return null;
        }
    }

    private parseParameters (action: Action, params, meta): void {
        params.forEach(() => {
            let parameter = this.parameterParserService.parse(action);
            assert(parameter);
            parameter.name = meta.parameters[action.parameters.length].name;
            action.addParameter(parameter);
        });
    }

    private tryParse (action: Action, statements, parsers): void {
        statements.forEach(statement => {
            let parsed = parsers.some(parser => {
                try {
                    return parser.call(this, action, statement);
                } catch (e) {}
            });
            if (!parsed) {
                throw new Error();
            }
        });
    }

    private parseSelfThis (action, statement): boolean {
        let [selfVariableDeclarator] = statement.declarations;
        assert(selfVariableDeclarator.id.name === 'self');
        assert(selfVariableDeclarator.init.type === 'ThisExpression');
        return true;
    }

    private parseInteraction (action, statement): boolean {
        this.interactionParserService.parse(action, statement);
        return true;
    }
}
