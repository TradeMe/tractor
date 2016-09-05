// Utilities:
import _ from 'lodash';
import Promise from 'bluebird';
import path from 'path';

// Dependencies:
import changecase from 'change-case';
import esquery from 'esquery';
import fileStructure from '../../file-structure';

export default {
    transformIdentifiers,
    transformMetadata,
    transformReferenceIdentifiers,
    transformReferencePath,
    transformReferences
};

function transformIdentifiers (file, oldName, newName) {
    let query = `Identifier[name="${oldName}"]`;
    _.each(esquery(file.ast, query), (identifier) => {
        identifier.name = newName;
    });
    return file.save();
}

function transformMetadata (file, type, oldName, newName) {
    let [comment] = file.ast.comments;
    let metaData = JSON.parse(comment.value);
    let item = metaData;
    if (type) {
        item = _.find(item[type], { name: oldName });
    }
    item.name = newName;
    comment.value = JSON.stringify(metaData);
    return file.save();
}

function transformReferenceIdentifiers (oldFilePath, oldName, newName) {
    let referencePaths = fileStructure.references[oldFilePath] || [];
    return Promise.map(referencePaths, (referencePath) => {
        let file = fileStructure.allFilesByPath[referencePath];
        return transformIdentifiers(file, oldName, newName);
    });
}

function transformReferencePath (file, oldFromPath, oldToPath, newFromPath, newToPath) {
    let oldRequirePath = getRelativeRequirePath(path.dirname(oldFromPath), oldToPath);
    let newRequirePath = getRelativeRequirePath(path.dirname(newFromPath), newToPath);
    let query = `CallExpression[callee.name="require"] Literal[value="${oldRequirePath}"]`;
    _.each(esquery(file.ast, query), (requirePathLiteral) => {
        requirePathLiteral.value = newRequirePath;
        requirePathLiteral.raw = `'${newRequirePath}'`;
    });
    return file.save();
}

function transformReferences (type, oldFilePath, newFilePath, oldName, newName) {
    let referencePaths = fileStructure.references[oldFilePath] || [];
    return Promise.map(referencePaths, (referencePath) => {
        let file = fileStructure.allFilesByPath[referencePath];

        return transformIdentifiers(file, changecase.pascal(oldName), changecase.pascal(newName))
        .then(() => transformIdentifiers(file, changecase.camel(oldName), changecase.camel(newName)))
        .then(() => transformMetadata(file, type, oldName, newName))
        .then(() => transformReferencePath(file, file.path, oldFilePath, file.path, newFilePath));
    });
}

function getRelativeRequirePath (from, to) {
    let relativePath = path.relative(from, to).replace(/\\/g, '/');
    return /^\./.test(relativePath) ? relativePath : `./${relativePath}`;
}
