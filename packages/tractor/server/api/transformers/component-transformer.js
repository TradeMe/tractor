'use strict';

// Dependencies:
import { camel, pascal } from 'change-case';
import fileStructure from '../../file-structure';
import transforms from './transforms';

export default function componentTransformer (file, options) {
    let { oldName, newName, oldPath, newPath } = options;

    transforms.transformIdentifiers(file, pascal(oldName), pascal(newName));
    transforms.transformIdentifiers(file, camel(oldName), camel(newName));
    transforms.transformMetadata(file, null, oldName, newName);

    let oldReferences = fileStructure.references[oldPath];
    if (oldReferences && oldReferences.length) {
        fileStructure.references[newPath] = oldReferences;
    }
    delete fileStructure.references[oldPath];

    return transforms.transformReferencePath('components', oldPath, newPath, oldName, newName)
    .then(() => transforms.transformReferenceIdentifiers(newPath, pascal(oldName), pascal(newName)))
    .then(() => transforms.transformReferenceIdentifiers(newPath, camel(oldName), camel(newName)));
}
