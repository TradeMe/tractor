// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY, VISUAL_REGRESSION_DIRECTORY } from './constants';

// Utilities:
import path from 'path';

export function getBaselinePath (config, filePath) {
    let visualRegressionPath = getVisualRegressionPath(config);
    let dirPath = path.join(visualRegressionPath, BASELINE_DIRECTORY);
    return filePath ? path.join(dirPath, filePath) : dirPath;
}

export function getChangesPath (config, filePath) {
    let visualRegressionPath = getVisualRegressionPath(config);
    let dirPath = path.join(visualRegressionPath, CHANGES_DIRECTORY);
    return filePath ? path.join(dirPath, filePath) : dirPath;
}

export function getDiffsPath (config, filePath) {
    let visualRegressionPath = getVisualRegressionPath(config);
    let dirPath = path.join(visualRegressionPath, DIFFS_DIRECTORY);
    return filePath ? path.join(dirPath, filePath) : dirPath;
}

export function getVisualRegressionPath (config) {
    let visualRegressionConfig = config.visualRegression || {};
    let visualRegressionPath = visualRegressionConfig.directory || path.join(config.directory, VISUAL_REGRESSION_DIRECTORY);
    return path.resolve(process.cwd(), visualRegressionPath);
}
