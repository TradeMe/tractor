// Dependencies:
import path from 'path';
import { warn } from 'tractor-logger';
import { createDir } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export function createTractorDirectory (config) {
    return createDir(path.join(process.cwd(), config.directory))
    .catch(TractorError.isTractorError, error => warn(`${error.message} Moving on...`));
}
createTractorDirectory['@Inject'] = ['config'];
