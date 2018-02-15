// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { createDir } from '@tractor/file-structure';
import { warn } from '@tractor/logger';
import path from 'path';

export function init (config) {
    let mockRequestsDirectoryPath = path.resolve(process.cwd(), config.mockRequests.directory);

    return createDir(mockRequestsDirectoryPath)
    .catch(TractorError.isTractorError, error => warn(`${error.message} Moving on...`));
}
init['@Inject'] = ['config'];
