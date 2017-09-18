// Constants:
const DEFAULT_DIRECTORY = './tractor/page-objects';

export function config (tractorConfig) {
    tractorConfig.pageObjects = tractorConfig.pageObjects || {};
    let { pageObjects } = tractorConfig;
    pageObjects.directory = pageObjects.directory || DEFAULT_DIRECTORY;
    return pageObjects;
}
