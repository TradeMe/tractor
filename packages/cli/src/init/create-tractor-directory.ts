// Dependencies:
import { createDir } from '@tractor/file-structure';
import { warn } from '@tractor/logger';
import * as path from 'path';

// Errors:
import { TractorConfigInternal } from '@tractor/config-loader';
import { TractorError } from '@tractor/error-handler';

export async function createTractorDirectory (config: TractorConfigInternal): Promise<void> {
    try {
        await createDir(path.join(process.cwd(), config.directory));
    } catch (e) {
        const error = e as TractorError;
        if (TractorError.isTractorError(error)) {
            warn(`${error.message} Moving on...`);
        }
    }
}
