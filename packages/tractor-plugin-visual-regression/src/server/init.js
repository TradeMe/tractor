// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY } from './constants';
const DIRECTORY_EXISTS = 'EEXIST';

// Utilities:
import Promise from 'bluebird';
import { getVisualRegressionPath } from './utils';

// Dependencies:
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';

function init (config) {
    let visualRegressionPath = getVisualRegressionPath(config);
    let baselinePath = path.join(visualRegressionPath, BASELINE_DIRECTORY);
    let changesPath = path.join(visualRegressionPath, CHANGES_DIRECTORY);
    let diffsPath = path.join(visualRegressionPath, DIFFS_DIRECTORY);

    return fs.mkdirAsync(visualRegressionPath)
    .catch(catchExists)
    .then(() => fs.mkdirAsync(baselinePath))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(changesPath))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(diffsPath))
    .catch(catchExists);
}
init['@Inject'] = ['config'];

function catchExists (e) {
    if (e.code != DIRECTORY_EXISTS) {
        throw e;
    }
}

export default init;
