// Dependencies:
import { match, parse } from 'esquery';
import { parseScript } from 'esprima';

// Queries:
const INTERACTION_QUERY = parse('AssignmentExpression[left.name="result"] > CallExpression > FunctionExpression > BlockStatement');
const OPTIONAL_HANDLER_QUERY = parse('CallExpression:has(CallExpression[callee.property.name="catch"])');
const RETURN_QUERY = parse('ReturnStatement');
const DECLARATION_QUERY = parse('VariableDeclaration');

export async function upgrade (file) {
    const { ast } = file;

    // Generate most of the new AST for the replacement code.
    // `null` will be replaced by the existing interaction.
    const OPTIONAL_INTERACTION_CODE = `function main () {
        var interaction = null;
        return interaction.then(null, function () {}); };
    `;
    const [INTERMEDIATE_RESULT_DECLARATION] = match(parseScript(OPTIONAL_INTERACTION_CODE), DECLARATION_QUERY);
    const [OPTIONAL_RESULT] = match(parseScript(OPTIONAL_INTERACTION_CODE), RETURN_QUERY);

    match(ast, INTERACTION_QUERY).forEach(interaction => {
        match(interaction, OPTIONAL_HANDLER_QUERY).forEach((handler) => {
            interaction.body = [];
            const [declarator] = INTERMEDIATE_RESULT_DECLARATION.declarations;
            declarator.init = handler.callee.object;
            interaction.body.push(INTERMEDIATE_RESULT_DECLARATION);
            interaction.body.push(OPTIONAL_RESULT);
        });
    });
}
