'use strict';

// Dependencies:
import { camel } from 'change-case';
import fileStructure from '../../file-structure';
import transforms from './transforms';

export default function mockDataTransformer (file, options) {
    let { oldName, newName, oldPath, newPath } = options;

    let oldReferences = fileStructure.references[oldPath];
    if (oldReferences && oldReferences.length) {
        fileStructure.references[newPath] = oldReferences;
        delete fileStructure.references[oldPath];
    }

    return transforms.transformReferencePath('mockData', oldPath, newPath, oldName, newName)
    .then(() => transforms.transformReferenceIdentifiers(newPath, camel(oldName), camel(newName)));
}
