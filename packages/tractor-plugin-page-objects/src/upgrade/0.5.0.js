// Queries:
const CONSTRUCTOR_FUNCTION = 'AssignmentExpression > CallExpression > FunctionExpression > BlockStatement > VariableDeclaration FunctionExpression';
const ELEMENT_ASSIGNMENT = 'FunctionExpression[id.name] > BlockStatement > ExpressionStatement > AssignmentExpression';
const ELEMENT_CALL_EXPRESSION = 'CallExpression[callee.name="element"]';
const ELEMENT_ALL_MEMBER_EXPRESSION = 'MemberExpression[object.name="element"][property.name="all"]';

// Code:
const FIND_EQUALS_CODE = 'var find = parent ? parent.element.bind(parent) : element;';

// Dependencies:
import * as esprima from 'esprima';
import esquery from 'esquery';
import { PageObjectFileRefactorer } from '../tractor/server/files/page-object-file-refactorer';

PageObjectFileRefactorer['0.5.0'] = upgrade;

export function upgradeFile (file) {
    return file.refactor('0.5.0');
}

function upgrade (file) {
    const FIND = {
        type: esprima.Syntax.Identifier,
        name: 'find'
    };
    const PARENT = {
        type: esprima.Syntax.Identifier,
        name: 'parent'
    };
    const [FIND_EQUALS_DECLARATION] = esprima.parse(FIND_EQUALS_CODE).body;

    esquery(file.ast, CONSTRUCTOR_FUNCTION).forEach(func => {
        func.params.push(PARENT);
        func.body.body.unshift(FIND_EQUALS_DECLARATION);
    });
    esquery(file.ast, ELEMENT_ASSIGNMENT).forEach(assignment => {
        esquery(assignment, ELEMENT_CALL_EXPRESSION).forEach(expression => {
            expression.callee = FIND;
        });
        esquery(assignment, ELEMENT_ALL_MEMBER_EXPRESSION).forEach(expression => {
            expression.object = FIND;
        });
    });
}
