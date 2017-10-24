// Constants:
const DEFAULT_DIRECTORY = './tractor/visual-regression';

export function config (tractorConfig) {
    tractorConfig.visualRegression = tractorConfig.visualRegression || {};
    let { visualRegression } = tractorConfig;
    visualRegression.directory = visualRegression.directory || DEFAULT_DIRECTORY;
    return visualRegression;
}
