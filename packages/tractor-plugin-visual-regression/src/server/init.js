// Constants:
const DIRECTORY_EXISTS = 'EEXIST';

// Utilities:
import Promise from 'bluebird';
import { getBaselinePath, getChangesPath, getDiffsPath, getVisualRegressionPath } from './utils';

// Dependencies:
const fs = Promise.promisifyAll(require('fs'));

function init (config) {
    return fs.mkdirAsync(getVisualRegressionPath(config))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(getBaselinePath(config)))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(getChangesPath(config)))
    .catch(catchExists)
    .then(() => fs.mkdirAsync(getDiffsPath(config)))
    .catch(catchExists);
}
init['@Inject'] = ['config'];

function catchExists (e) {
    if (e.code != DIRECTORY_EXISTS) {
        throw e;
    }
}

export default init;
