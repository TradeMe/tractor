'use strict';

// Dependencies:
import { camel } from 'change-case';
import transforms from './transforms';

export default function mockDataTransformer (file, options) {
    let { oldName, newName, oldPath, newPath } = options;

    return transforms.transformReferences('mockData', oldPath, newPath, oldName, newName)
    .then(() => transforms.transformReferenceIdentifiers(newPath, camel(oldName), camel(newName)));
}
