// Dependencies:
import path from 'path';
import { warn } from 'tractor-logger';
import { createDir } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function init (config) {
    let mockRequestsDirectoryPath = path.resolve(process.cwd(), config.mockRequests.directory);

    return createDir(mockRequestsDirectoryPath)
    .catch(TractorError.isTractorError, error => warn(`${error.message} Moving on...`));
}
init['@Inject'] = ['config'];
