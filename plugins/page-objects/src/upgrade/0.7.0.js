// Dependencies:
import { match, parse } from 'esquery';

// Queries:
const CLASS_BLOCK_QUERY = 'AssignmentExpression > CallExpression > FunctionExpression > BlockStatement';
const CONSTRUCTOR_FUNCTION_QUERY = `${CLASS_BLOCK_QUERY} > VariableDeclaration > VariableDeclarator > FunctionExpression`;
const PARENT_IDENTIFIER_QUERY = 'Identifier[name="parent"]';
const PARENT_ARGUMENT_QUERY = parse(`${CONSTRUCTOR_FUNCTION_QUERY} > ${PARENT_IDENTIFIER_QUERY}`);
const FIND_DECLARATORS_QUERY = `${CONSTRUCTOR_FUNCTION_QUERY} > BlockStatement > VariableDeclaration > VariableDeclarator`;
const FIND_DECLARATION_PARENT_QUERY = parse(`${FIND_DECLARATORS_QUERY}:has(Identifier[name="find"]) ${PARENT_IDENTIFIER_QUERY}`);
const FIND_ALL_DECLARATION_PARENT_QUERY = parse(`${FIND_DECLARATORS_QUERY}:has(Identifier[name="findAll"]) ${PARENT_IDENTIFIER_QUERY}`);


export async function upgrade (file) {
    const { ast } = file;

    [
        ...match(ast, PARENT_ARGUMENT_QUERY),
        ...match(ast, FIND_DECLARATION_PARENT_QUERY),
        ...match(ast, FIND_ALL_DECLARATION_PARENT_QUERY)
    ]
    .forEach(identifier => identifier.name = 'host');
}
