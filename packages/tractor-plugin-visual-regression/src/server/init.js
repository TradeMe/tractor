// Dependencies:
import { mkdirSync } from 'fs';
import { join } from 'path';

// Constants:
import CONSTANTS from './constants';
const DIRECTORY_EXISTS = 'EEXIST';

function init (config) {
    try {
        mkdirSync(join(config.testDirectory, CONSTANTS.VISUAL_REGRESSION_DIRECTORY));
    } catch (e) {
        catchExist(e);
    }

    try {
        mkdirSync(join(config.testDirectory, CONSTANTS.VISUAL_REGRESSION_DIRECTORY, CONSTANTS.BASELINE_DIRECTORY));
    } catch (e) {
        catchExist(e);
    }

    try {
        mkdirSync(join(config.testDirectory, CONSTANTS.VISUAL_REGRESSION_DIRECTORY, CONSTANTS.CHANGES_DIRECTORY));
    } catch (e) {
        catchExist(e);
    }
}

function catchExist (e) {
    if (e.code != DIRECTORY_EXISTS) {
        throw e;
    }
}

export default init;
