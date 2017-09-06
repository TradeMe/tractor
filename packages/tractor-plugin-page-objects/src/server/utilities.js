// Constants:
const DEFAULT_DIRECTORY = './tractor/page-objects';

export function getConfig (config) {
    config.pageObjects = config.pageObjects || {};
    let { pageObjects } = config;
    pageObjects.directory = pageObjects.directory || DEFAULT_DIRECTORY;
    return pageObjects;
}
