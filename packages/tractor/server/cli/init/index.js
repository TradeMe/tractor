'use strict';

// Config:
import { config } from '../../config';

// Utilities:
import log from 'npmlog';

// Dependencies:
import createTestDirectoryStructure from './create-test-directory-structure';
import createBaseTestFiles from './create-base-test-files';
import installTractorDependenciesLocally from './install-tractor-dependencies-locally';
import setUpSelenium from './set-up-selenium';

export default function init () {
    log.info('Setting up tractor...');

    return createTestDirectoryStructure.run(config.testDirectory)
    .then(() => createBaseTestFiles.run(config.testDirectory))
    .then(() => installTractorDependenciesLocally.run())
    .then(() => setUpSelenium.run())
    .then(() => log.info('Set up complete!'))
    .catch((error) => {
        log.error('Something broke, sorry :(');
        log.error(error.message);
        throw error;
    });
}
