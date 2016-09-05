// Dependencies:
import { camel, pascal } from 'change-case';
import transforms from './transforms';

export default function componentTransformer (file, options) {
    let { oldName, newName, oldPath, newPath } = options;

    return transforms.transformIdentifiers(file, pascal(oldName), pascal(newName))
    .then(() => transforms.transformIdentifiers(file, camel(oldName), camel(newName)))
    .then(() => transforms.transformMetadata(file, null, oldName, newName))
    .then(() => transforms.transformReferences('components', oldPath, newPath, oldName, newName))
    .then(() => transforms.transformReferenceIdentifiers(oldPath, pascal(oldName), pascal(newName)))
    .then(() => transforms.transformReferenceIdentifiers(oldPath, camel(oldName), camel(newName)));
}
