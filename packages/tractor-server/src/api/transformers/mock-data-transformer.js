// Dependencies:
import changeCase from 'change-case';
import transforms from './transforms';

export default function mockDataTransformer (file, options) {
    let { oldName, newName, oldPath, newPath } = options;

    return transforms.transformReferences('mockData', oldPath, newPath, oldName, newName)
    .then(() => transforms.transformReferenceIdentifiers(newPath, changeCase.camel(oldName), changeCase.camel(newName)));
}
