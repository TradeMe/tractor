// Dependencies:
import { warn } from 'tractor-logger';
import { createDir } from 'tractor-file-structure';

import { getBaselinePath, getChangesPath, getDiffsPath, getVisualRegressionPath } from './utilities';

// Errors:
import { TractorError } from 'tractor-error-handler';

export async function init (config) {
    try {
        await createDir(getVisualRegressionPath(config));
        await createDir(getBaselinePath(config));
        await createDir(getChangesPath(config));
        await createDir(getDiffsPath(config));
    } catch (error) {
        if (TractorError.isTractorError(error)) {
            warn(`${error.message} Moving on...`)
        } else {
            throw error;
        }
    }
}
init['@Inject'] = ['config'];
