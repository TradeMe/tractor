// Constants:
const BASE_FILE_SOURCES = 'base-file-sources';
const PROTRACTOR_CONF_FILE_NAME = 'protractor.conf.js';

// Dependencies:
import { TractorConfigInternal } from '@tractor/config-loader';
import { copyFile } from '@tractor/file-structure';
import { warn } from '@tractor/logger';
import * as path from 'path';

// Errors:
import { TractorError } from '@tractor/error-handler';

export async function copyProtractorConfig (config: TractorConfigInternal): Promise<void> {
    const readPath = path.join(__dirname, BASE_FILE_SOURCES, PROTRACTOR_CONF_FILE_NAME);
    const writePath = path.join(process.cwd(), config.directory, PROTRACTOR_CONF_FILE_NAME);

    try {
        await copyFile(readPath, writePath);
    } catch (e) {
        const error = e as TractorError;
        if (TractorError.isTractorError(error)) {
            warn(`${error.message} Not copying...`);
        }
    }
}
