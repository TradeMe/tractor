'use strict';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import fileStructure from '../../file-structure';
import transforms from './transforms';

export default function stepDefinitionTransformer (file, options) {
    let { oldPath, newPath } = options;

    let references = Object.keys(fileStructure.references)
    .filter((reference) => {
        return fileStructure.references[reference].includes(oldPath);
    });

    return Promise.map(references, (reference) => {
        return transforms.transformReferencePath(file, oldPath, reference, newPath, reference);
    });
}
