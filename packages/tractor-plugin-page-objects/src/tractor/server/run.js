// Dependencies:
import Promise from 'bluebird';

export function run (
    pageObjectsFileStructure,
    includeFileStructures
) {
    // eslint-disable-next-line
    debugger;
    return Promise.all([
        pageObjectsFileStructure.read(),
        Promise.map(includeFileStructures, includeFileStructure => includeFileStructure.read())
    ]);
}
run['@Inject'] = ['pageObjectsFileStructure', 'includeFileStructures'];
