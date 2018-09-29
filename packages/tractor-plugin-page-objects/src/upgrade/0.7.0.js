// Queries:
const CLASS_BLOCK_QUERY = 'AssignmentExpression > CallExpression > FunctionExpression > BlockStatement';
const CONSTRUCTOR_FUNCTION_QUERY = `${CLASS_BLOCK_QUERY} > VariableDeclaration > VariableDeclarator > FunctionExpression`;
const PARENT_IDENTIFIER_QUERY = 'Identifier[name="parent"]';
const PARENT_ARGUMENT_QUERY = `${CONSTRUCTOR_FUNCTION_QUERY} > ${PARENT_IDENTIFIER_QUERY}`;
const FIND_DECLARATORS_QUERY = `${CONSTRUCTOR_FUNCTION_QUERY} > BlockStatement > VariableDeclaration > VariableDeclarator`;
const FIND_DECLARATION_PARENT_QUERY = `${FIND_DECLARATORS_QUERY}:has(Identifier[name="find"]) ${PARENT_IDENTIFIER_QUERY}`;
const FIND_ALL_DECLARATION_PARENT_QUERY = `${FIND_DECLARATORS_QUERY}:has(Identifier[name="findAll"]) ${PARENT_IDENTIFIER_QUERY}`;

// Dependencies:
import esquery from 'esquery';

export async function upgrade (file) {
    const { ast } = file;

    [
        esquery(ast, PARENT_ARGUMENT_QUERY),
        esquery(ast, FIND_DECLARATION_PARENT_QUERY),
        esquery(ast, FIND_ALL_DECLARATION_PARENT_QUERY)
    ]
    .flatten().forEach(identifier => identifier.name = 'host');
}
