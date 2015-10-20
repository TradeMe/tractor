'use strict';

// Utilities:
import _ from 'lodash';
import Promise from 'bluebird';
import { dirname, relative } from 'path';

// Dependencies:
import esquery from 'esquery';
import fileStructure from '../../file-structure';

export default {
    transformIdentifiers,
    transformMetadata,
    transformReferenceIdentifiers,
    transformReferencePath
};

function transformIdentifiers (file, oldName, newName) {
    let query = `Identifier[name="${oldName}"]`;
    _.each(esquery(file.ast, query), (identifier) => {
        identifier.name = newName;
    });
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
}

function transformReferenceIdentifiers (newFilePath, oldName, newName) {
    let referencePaths = fileStructure.references[newFilePath] || [];
    return Promise.map(referencePaths, (referencePath) => {
        let file = fileStructure.allFilesByPath[referencePath];
        transformIdentifiers(file, oldName, newName);
        return file.save();
    });
}

function transformReferencePath (type, oldFilePath, newFilePath, oldName, newName) {
    let referencePaths = fileStructure.references[newFilePath] || [];
    return Promise.map(referencePaths, (referencePath) => {
        let file = fileStructure.allFilesByPath[referencePath];
        let oldRequirePath = getRelativeRequirePath(dirname(referencePath), oldFilePath);
        let newRequirePath = getRelativeRequirePath(dirname(referencePath), newFilePath);
        let query = `CallExpression[callee.name="require"] Literal[value="${oldRequirePath}"]`;
        _.each(esquery(file.ast, query), (requirePathLiteral) => {
            requirePathLiteral.value = newRequirePath;
            requirePathLiteral.raw = `'${newRequirePath}'`;
        });
        transformMetadata(file, type, oldName, newName);
        return file.save();
    });
}

function getRelativeRequirePath (from, to) {
    let relativePath = relative(from, to).replace(/\\/g, '/');
    return /^\./.test(relativePath) ? relativePath : `./${relativePath}`;
}
