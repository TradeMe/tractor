// Queries:
const ELEMENT_ASSIGNMENT = 'FunctionExpression[id.name] > BlockStatement > ExpressionStatement > AssignmentExpression';
const ELEMENT_GROUP_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement';
const ELEMENT_GROUP_TYPE_QUERY = `${ELEMENT_GROUP_QUERY} > NewExpression > Identifier`;
const PAGE_OBJECT_REQUIRE_QUERY = name => `VariableDeclaration > VariableDeclarator[id.name="${name}"] > CallExpression[callee.name="require"]`;

// Dependencies:
import { FileStructure } from '@tractor/file-structure';
import esquery from 'esquery';
import path from 'path';
import { PageObjectFileRefactorer } from '../tractor/server/files/page-object-file-refactorer';
import { PageObjectFile } from '../tractor/server/files/page-object-file';
import { getMeta, getMetaToken } from './get-meta';

PageObjectFileRefactorer['0.5.2'] = upgrade;

export function upgradeFile (file) {
    return file.refactor('0.5.2');
}

async function upgrade (file) {
    const metaToken = getMetaToken(file);
    const metaData = JSON.parse(metaToken.value);

    await Promise.all(esquery(file.ast, ELEMENT_ASSIGNMENT).map(async assignment => {
        const assignmentName = assignment.left.property.name;            
        const elementMetaData = metaData.elements.find(element => element.name === assignmentName);

        const [elementGroup] = esquery(assignment, ELEMENT_GROUP_QUERY);
        const [typedElementGroup] = esquery(assignment, ELEMENT_GROUP_TYPE_QUERY);
        if (elementGroup) {
            elementMetaData.type = true;
        }
        if (typedElementGroup) {
            const [requireStatement] = esquery(file.ast, PAGE_OBJECT_REQUIRE_QUERY(typedElementGroup.name));
            const [requirePath] = requireStatement.arguments;
            const pageObjectFilePath = path.resolve(path.dirname(file.path), requirePath.value);
            const pageObjectDirectory = path.dirname(pageObjectFilePath);
            const pageObjectFileStructure = new FileStructure(pageObjectDirectory);
            const pageObject = new PageObjectFile(pageObjectFilePath, pageObjectFileStructure);
            await pageObject.read();
            elementMetaData.type = getMeta(pageObject).name;
        }
    }));

    metaToken.value = JSON.stringify(metaData);
}
