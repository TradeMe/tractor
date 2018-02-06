// Constants:
const BASE_FILE_SOURCES = 'base-file-sources';
const PROTRACTOR_CONF_FILE_NAME = 'protractor.conf.js';

// Dependencies:
import path from 'path';
import { copyFile } from '@tractor/file-structure';
import { warn } from '@trademe/logger';

// Errors:
import { TractorError } from '@tractor/error-handler';

export function copyProtractorConfig (config) {
    let readPath = path.join(__dirname, BASE_FILE_SOURCES, PROTRACTOR_CONF_FILE_NAME);
    let writePath = path.join(process.cwd(), config.directory, PROTRACTOR_CONF_FILE_NAME);

    return copyFile(readPath, writePath)
    .catch(TractorError.isTractorError, error => warn(`${error.message} Not copying...`));
}
copyProtractorConfig['@Inject'] = ['config'];
