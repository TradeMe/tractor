// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY, VISUAL_REGRESSION_DIRECTORY } from './constants';
const DIRECTORY_EXISTS = 'EEXIST';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';

function init (config) {
    let visualRegressionPath = path.join(config.testDirectory, VISUAL_REGRESSION_DIRECTORY);
    let baselinePath = path.join(config.testDirectory, VISUAL_REGRESSION_DIRECTORY, BASELINE_DIRECTORY);
    let changesPath = path.join(config.testDirectory, VISUAL_REGRESSION_DIRECTORY, CHANGES_DIRECTORY);
    let diffsPath = path.join(config.testDirectory, VISUAL_REGRESSION_DIRECTORY, DIFFS_DIRECTORY);

    return fs.mkdirAsync(visualRegressionPath)
    .catch(catchExists)
    .then(() => fs.mkdirAsync(baselinePath))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(changesPath))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(diffsPath))
    .catch(catchExists);
}

function catchExists (e) {
    if (e.code != DIRECTORY_EXISTS) {
        throw e;
    }
}

export default init;
