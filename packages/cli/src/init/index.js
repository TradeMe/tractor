// Promisify:
import { promisifyAll } from 'bluebird';
promisifyAll(require('child_process'));

// Dependencies:
import { error, info } from '@tractor/logger';
import { copyProtractorConfig } from './copy-protractor-config';
import { createTractorDirectory } from './create-tractor-directory';
import { initialisePlugins } from './initialise-plugins';

export async function init (di) {
    info('Setting up tractor...');

    try {
        await di.call(createTractorDirectory);
        await di.call(copyProtractorConfig);
        await di.call(initialisePlugins);
        info('Set up complete!');
    } catch (e) {
        error('Something broke, sorry 😕');
        error(e.message);
        throw e;
    }
}
init['@Inject'] = ['di'];
