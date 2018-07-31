// Dependencies:
import { warn } from '@tractor/logger';

export async function run (
    di,
    mochaSpecsFileStructure
) {
    let readMockRequests = null;
    try {
        readMockRequests = di.call(addMockRequests);
    } catch (e) {
        warn('@tractor-plugins/mock-requests is not installed. Mock requests will not be available.');
    }

    let readPageObjects = null;
    try {
        readPageObjects = di.call(addPageObjects);
    } catch (e) {
        warn('@tractor-plugins/page-objects is not installed. Page Objects will not be available.');
    }

    await Promise.all([readMockRequests, readPageObjects]);
    return mochaSpecsFileStructure.read();
}
run['@Inject'] = ['di', 'mochaSpecsFileStructure'];

function addMockRequests (
    mockRequestsFileStructure,
    mochaSpecsFileStructure
) {
    mochaSpecsFileStructure.referenceManager.addFileStructure(mockRequestsFileStructure);
    return mockRequestsFileStructure.read();
}
addMockRequests['@Inject'] = ['mockRequestsFileStructure', 'mochaSpecsFileStructure'];

async function addPageObjects (
    pageObjectsFileStructure,
    includeFileStructures,
    mochaSpecsFileStructure
) {
    mochaSpecsFileStructure.referenceManager.addFileStructure(pageObjectsFileStructure);
    await Promise.all(includeFileStructures.map(fileStructure => {
        mochaSpecsFileStructure.referenceManager.addFileStructure(fileStructure);
        pageObjectsFileStructure.referenceManager.addFileStructure(fileStructure);
        return fileStructure.read();
    }));
    return pageObjectsFileStructure.read();
}
addPageObjects['@Inject'] = ['pageObjectsFileStructure', 'includeFileStructures', 'mochaSpecsFileStructure'];
