// Utilities:
import { getConfig } from 'tractor-config-loader';
import { error, info } from 'tractor-logger';

// Dependencies:
import { createTestDirectoryStructure } from './create-test-directory-structure';
import { createBaseTestFiles } from './create-base-test-files';
import { initialisePlugins } from './initialise-plugins';
import { installTractorDependenciesLocally } from './install-tractor-dependencies-locally';
import { setUpSelenium } from './set-up-selenium';

export default function init () {
    info('Setting up tractor...');
    let config = getConfig();

    return createTestDirectoryStructure(config.testDirectory)
    .then(() => createBaseTestFiles(config.testDirectory))
    .then(() => installTractorDependenciesLocally())
    .then(() => setUpSelenium())
    .then(() => initialisePlugins())
    .then(() => info('Set up complete!'))
    .catch(e => {
        error('Something broke, sorry 😕');
        error(e.message);
        throw e;
    });
}
