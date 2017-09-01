// Utilities:
import { error, info } from 'tractor-logger';

// Dependencies:
import { createTractorDirectoryStructure } from './create-tractor-directory-structure';
import { createBaseTractorFiles } from './create-base-tractor-files';
import { initialisePlugins } from './initialise-plugins';
import { installTractorLocally } from './install-tractor-locally';
import { setUpSelenium } from './set-up-selenium';

export function init (di) {
    info('Setting up tractor...');

    return di.call(createTractorDirectoryStructure)
    .then(() => di.call(createBaseTractorFiles))
    .then(() => di.call(installTractorLocally))
    .then(() => di.call(setUpSelenium))
    .then(() => di.call(initialisePlugins))
    .then(() => info('Set up complete!'))
    .catch(e => {
        error('Something broke, sorry 😕');
        error(e.message);
        throw e;
    });
}
init['@Inject'] = ['di'];
