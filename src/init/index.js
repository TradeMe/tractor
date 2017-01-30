// Utilities:
import tractorConfigLoader from 'tractor-config-loader';
import { error, info } from 'tractor-logger';

// Config:
const CONFIG = tractorConfigLoader.loadConfig();

// Dependencies:
import createTestDirectoryStructure from './create-test-directory-structure';
import createBaseTestFiles from './create-base-test-files';
import installTractorDependenciesLocally from './install-tractor-dependencies-locally';
import setUpSelenium from './set-up-selenium';

export default function init () {
    info('Setting up tractor...');

    return createTestDirectoryStructure.run(CONFIG.testDirectory)
    .then(() => createBaseTestFiles.run(CONFIG.testDirectory))
    .then(() => installTractorDependenciesLocally.run())
    .then(() => setUpSelenium.run())
    .then(() => info('Set up complete!'))
    .catch(e => {
        error('Something broke, sorry :(');
        error(e.message);
        throw e;
    });
}
