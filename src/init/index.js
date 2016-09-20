// Dependencies:
import tractorConfigLoader from 'tractor-config-loader';

// Config:
const CONFIG = tractorConfigLoader.loadConfig();

// Dependencies:
import createTestDirectoryStructure from './create-test-directory-structure';
import createBaseTestFiles from './create-base-test-files';
import installTractorDependenciesLocally from './install-tractor-dependencies-locally';
import setUpSelenium from './set-up-selenium';

export default function init () {
    console.info('Setting up tractor...');

    return createTestDirectoryStructure.run(CONFIG.testDirectory)
    .then(() => createBaseTestFiles.run(CONFIG.testDirectory))
    .then(() => installTractorDependenciesLocally.run())
    .then(() => setUpSelenium.run())
    .then(() => console.info('Set up complete!'))
    .catch(error => {
        console.error('Something broke, sorry :(');
        console.error(error.message);
        throw error;
    });
}
