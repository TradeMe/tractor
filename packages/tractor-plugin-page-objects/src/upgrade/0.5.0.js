// Queries:
const CONSTRUCTOR_FUNCTION = 'AssignmentExpression > CallExpression > FunctionExpression > BlockStatement > VariableDeclaration > VariableDeclarator > FunctionExpression';
const ELEMENT_ASSIGNMENT = 'FunctionExpression[id.name] > BlockStatement > ExpressionStatement > AssignmentExpression';
const ELEMENT_BY_CSS_CALL_EXPRESSION = 'AssignmentExpression > CallExpression[callee.name="element"] > CallExpression > MemberExpression[object.name="by"][property.name="css"]';

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

    let hasElementByCss = false;
    esquery(file.ast, ELEMENT_ASSIGNMENT).forEach(assignment => {
        let [elementByCss] = esquery(assignment, ELEMENT_BY_CSS_CALL_EXPRESSION);
        if (elementByCss) {
            hasElementByCss = true;
            assignment.right.callee = FIND;
        }
    });

    esquery(file.ast, CONSTRUCTOR_FUNCTION).forEach(func => {
        if (hasElementByCss) {
            func.params.push(PARENT);
            func.body.body.unshift(FIND_EQUALS_DECLARATION);
        }
    });
}
