// Dependencies:
import { FileStructure, serveFileStructure } from '@tractor/file-structure';
import path from 'path';
import { MockRequestFile } from './files/mock-request-file';

export function serve (config, di) {
    let mockRequestsDirectoryPath = path.resolve(process.cwd(), config.mockRequests.directory);

    let mockRequestsFileStructure = new FileStructure(mockRequestsDirectoryPath, 'mock-requests');
    mockRequestsFileStructure.addFileType(MockRequestFile);

    di.constant({ mockRequestsFileStructure });
    di.call(serveFileStructure)(mockRequestsFileStructure);
}
serve['@Inject'] = ['config', 'di'];
