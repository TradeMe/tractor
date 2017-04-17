// Constants:
import { VISUAL_REGRESSION_DIRECTORY } from './constants';

// Utilities:
import path from 'path';

export function getVisualRegressionPath (config) {
    let visualRegressionConfig = config.visualRegression || {};
    let visualRegressionPath = visualRegressionConfig.directory || path.join(config.directory, VISUAL_REGRESSION_DIRECTORY);
    return path.resolve(process.cwd(), visualRegressionPath);
}
