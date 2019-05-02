// Dependencies:
import { match, parse } from 'esquery';

// Queries:
const TEST_BODY_QUERY = parse('CallExpression > MemberExpression[object.name="it"] > FunctionExpression > BlockStatement, CallExpression[callee.name="it"] > FunctionExpression > BlockStatement');
const RETRY_EXPRESSION_QUERY = parse('ExpressionStatement:has(CallExpression[callee.property.name="retries"])');
const IMPORT_DECLARATIONS_QUERY = parse('VariableDeclaration:has(CallExpression[callee.name="require"])');
const NODE_MODULES_IMPORT_QUERY = parse('CallExpression[callee.name="require"] > Literal[value=/node_modules/]');
const LITERAL_QUERY = parse('Literal');

export async function upgrade (file) {
    const { ast } = file;

    match(ast, NODE_MODULES_IMPORT_QUERY).forEach(identifier => {
        identifier.value = identifier.value.replace(/^(\.\/)*(\.\.\/)*node_modules\//g, '');
        identifier.raw = identifier.raw.replace(/^(\.\/)*(\.\.\/)*node_modules\//g, '');
    });

    match(ast, TEST_BODY_QUERY).forEach(test => {
        const retry = match(test, RETRY_EXPRESSION_QUERY) || [];
        const imports = match(test, IMPORT_DECLARATIONS_QUERY);
        test.body = test.body.filter(statement => !imports.includes(statement) && !retry.includes(statement));
        const sortedImports = imports.sort((a, b) => {
            const [pathA] = match(a, LITERAL_QUERY);
            const [pathB] = match(b, LITERAL_QUERY);
            return pathA.value < pathB.value ? 1 : pathA.value > pathB.value ? -1 : 0;
        });
        test.body = [...retry, ...sortedImports, ...test.body];
    });
}
