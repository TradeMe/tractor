// Promisify:
import Promise from 'bluebird';
Promise.promisifyAll(require('child_process'));

// Dependencies:
import { error, info } from '@tractor/logger';
import { copyProtractorConfig } from './copy-protractor-config';
import { createTractorDirectory } from './create-tractor-directory';
import { initialisePlugins } from './initialise-plugins';

export function init (di) {
    info('Setting up tractor...');

    return di.call(createTractorDirectory)
    .then(() => di.call(copyProtractorConfig))
    .then(() => di.call(initialisePlugins))
    .then(() => info('Set up complete!'))
    .catch(e => {
        error('Something broke, sorry 😕');
        error(e.message);
        throw e;
    });
}
init['@Inject'] = ['di'];
