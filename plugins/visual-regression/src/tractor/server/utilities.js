// Dependencies:
import path from 'path';

// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY } from './constants';

export function getBaselinePath (config, filePath) {
    let dirPath = path.join(getVisualRegressionPath(config), BASELINE_DIRECTORY);
    return filePath ? path.join(dirPath, filePath) : dirPath;
}

export function getChangesPath (config, filePath) {
    let dirPath = path.join(getVisualRegressionPath(config), CHANGES_DIRECTORY);
    return filePath ? path.join(dirPath, filePath) : dirPath;
}

export function getDiffsPath (config, filePath) {
    let dirPath = path.join(getVisualRegressionPath(config), DIFFS_DIRECTORY);
    return filePath ? path.join(dirPath, filePath) : dirPath;
}

export function getVisualRegressionPath (config) {
    return path.resolve(process.cwd(), config.visualRegression.directory);
}
