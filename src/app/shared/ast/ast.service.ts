'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Utilities:
import * as isRegExp from 'lodash.isregexp';

// Dependencies:
import * as estemplate from 'estemplate';
import * as escodegen from 'escodegen';

@Injectable()
export class ASTService {
    public file (expression: ESCodeGen.Expression, meta: string): ESCodeGen.Program {
        return this.program([this.expressionStatement(expression)], [this.blockComment(meta)]);
    }

    public expression (template: string, objects = {}): ESCodeGen.Statement | ESCodeGen.Expression | any {
        let [statement] = estemplate(template, objects).body;
        return statement ? (<ESCodeGen.ExpressionStatement>statement).expression || (<ESCodeGen.Literal>statement).value || statement : null;
    }

    public template (template: string, objects = {}): ESCodeGen.Statement {
        let [statement] = estemplate(template, objects).body;
        return statement;
    }

    public expressionStatement (expression: ESCodeGen.Expression): ESCodeGen.ExpressionStatement {
        return {
            type: 'ExpressionStatement',
            expression
        };
    }

    public identifier (name: string): ESCodeGen.Identifier {
        return {
            type: 'Identifier',
            name
        };
    }

    public literal (value: string | boolean | number | RegExp): ESCodeGen.Literal {
        let lit: ESCodeGen.Literal = {
            type: 'Literal',
            value
        };
        if (isRegExp(value)) {
            lit.raw = `${value}`;
        }
        return lit;
    }

    public toJS (ast: ESCodeGen.Node): string {
        return escodegen.generate(ast);
    }

    private program (body: Array<ESCodeGen.Statement>, comments: Array<ESCodeGen.BlockComment>): ESCodeGen.Program {
        return {
            type: 'Program',
            body: body || [],
            comments: comments || []
        };
    }

    private blockComment (value: string): ESCodeGen.BlockComment {
        return {
            type: 'Block',
            value
        };
    }
}

export const AST_PROVIDERS = [
    ASTService
];
