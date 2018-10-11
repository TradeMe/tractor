// Queries:
const ELEMENT_ASSIGNMENT = 'FunctionExpression[id.name] > BlockStatement > ExpressionStatement > AssignmentExpression';
const ELEMENT_TYPE_QUERY = `NewExpression > Identifier`;
const ELEMENT_GROUP_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement';
const ELEMENT_GROUP_TYPE_QUERY = `${ELEMENT_GROUP_QUERY} > ${ELEMENT_TYPE_QUERY}`;
const PAGE_OBJECT_REQUIRE_QUERY = name => `VariableDeclaration > VariableDeclarator[id.name="${name}"] > CallExpression[callee.name="require"]`;

// Dependencies:
import { FileStructure } from '@tractor/file-structure';
import esquery from 'esquery';
import path from 'path';
import { PageObjectFile } from '../tractor/server/files/page-object-file';

export async function upgrade (file) {
    const { ast } = file;
    const [metaToken] = ast.comments;
    const metaData = JSON.parse(metaToken.value);

    await Promise.all(esquery(file.ast, ELEMENT_ASSIGNMENT).map(async (assignment, index) => {
        const elementMetaData = metaData.elements[index];

        if (!elementMetaData) {
            return;
        }

        if (elementMetaData.type === true) {
            delete elementMetaData.type;
        }

        const [typedElement] = esquery(assignment, ELEMENT_TYPE_QUERY);
        const [elementGroup] = esquery(assignment, ELEMENT_GROUP_QUERY);
        const [typedElementGroup] = esquery(assignment, ELEMENT_GROUP_TYPE_QUERY);
        if (elementGroup || typedElementGroup) {
            elementMetaData.group = true;
        }
        if (typedElement || typedElementGroup) {
            const typed = typedElement || typedElementGroup;
            const [requireStatement] = esquery(file.ast, PAGE_OBJECT_REQUIRE_QUERY(typed.name));
            const [requirePath] = requireStatement.arguments;
            const pageObjectFilePath = path.resolve(path.dirname(file.path), requirePath.value);
            const pageObjectDirectory = path.dirname(pageObjectFilePath);
            const pageObjectFileStructure = new FileStructure(pageObjectDirectory);
            const pageObject = new PageObjectFile(pageObjectFilePath, pageObjectFileStructure);
            const { name } = await pageObject.meta();
            elementMetaData.type = name;
        }
    }));

    metaToken.value = JSON.stringify(metaData);
}
