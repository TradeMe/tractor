// Dependencies:
import changeCase from 'change-case';
import transforms from './transforms';

export default function componentTransformer (file, options) {
    let { oldName, newName, oldPath, newPath } = options;

    return transforms.transformIdentifiers(file, changeCase.pascal(oldName), changeCase.pascal(newName))
    .then(() => transforms.transformIdentifiers(file, changeCase.camel(oldName), changeCase.camel(newName)))
    .then(() => transforms.transformMetadata(file, null, oldName, newName))
    .then(() => transforms.transformReferences('components', oldPath, newPath, oldName, newName))
    .then(() => transforms.transformReferenceIdentifiers(oldPath, changeCase.pascal(oldName), changeCase.pascal(newName)))
    .then(() => transforms.transformReferenceIdentifiers(oldPath, changeCase.camel(oldName), changeCase.camel(newName)));
}
