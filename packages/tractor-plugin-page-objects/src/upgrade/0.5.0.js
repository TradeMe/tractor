// Queries:
const CLASS_BLOCK = 'AssignmentExpression > CallExpression > FunctionExpression > BlockStatement';
const CONSTRUCTOR_FUNCTION = `${CLASS_BLOCK} > VariableDeclaration > VariableDeclarator > FunctionExpression`;
const ELEMENT_ASSIGNMENT = 'FunctionExpression[id.name] > BlockStatement > ExpressionStatement > AssignmentExpression';
const ELEMENT_BY_CSS_CALL_EXPRESSION = 'AssignmentExpression > CallExpression[callee.name="element"] > CallExpression > MemberExpression[object.name="by"][property.name="css"]';
const ACTION_FUNCTION = `${CLASS_BLOCK} > ExpressionStatement > AssignmentExpression > FunctionExpression`;
const INTERACTION_CALL_EXPRESSION = 'CallExpression[callee.property.name!="then"]';

// Dependencies:
import * as esprima from 'esprima';
import esquery from 'esquery';

export async function upgrade (file) {
    const FIND = {
        type: esprima.Syntax.Identifier,
        name: 'find'
    };
    const PARENT = {
        type: esprima.Syntax.Identifier,
        name: 'parent'
    };    

    const FIND_EQUALS_CODE = 'var find = parent ? parent.element.bind(parent) : element;';
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

    const INITIAL_RESULT_CODE = 'var result = Promise.resolve();';
    const [INITIAL_RESULT_DECLARATION] = esprima.parse(INITIAL_RESULT_CODE).body;

    const RETURN_RESULT = {
        type: 'ReturnStatement',
        argument: { 
            type: 'Identifier',
            name: 'result' 
        }
    };

    esquery(file.ast, ACTION_FUNCTION).forEach(func => {
        const block = func.body;
        const interactions = esquery(func, INTERACTION_CALL_EXPRESSION);
        if (interactions.length) {
            const [SELF_DECLARATION] = block.body;
            block.body = [SELF_DECLARATION, INITIAL_RESULT_DECLARATION];

            interactions.forEach(interaction => {
                block.body.push(createInteractionExpression(interaction));
            });
    
            block.body.push(RETURN_RESULT);
        }
    });
}

function createInteractionExpression (interaction) {
    const [interactionExpression] = esprima.parse('result = result.then(function () { return; });').body;
    esquery(interactionExpression, 'ReturnStatement').forEach(returnStatement => {
        returnStatement.argument = interaction;
    });
    return interactionExpression;
}
