// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { error, info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';
import { copyProtractorConfig } from './copy-protractor-config';
import { createTractorDirectory } from './create-tractor-directory';
import { initialisePlugins } from './initialise-plugins';

export async function init (tractor: Tractor): Promise<void> {
    info('Setting up tractor...');

    try {
        await createTractorDirectory(tractor.config);
        await copyProtractorConfig(tractor.config);
        await initialisePlugins(tractor);
        info('Set up complete!');
    } catch (e) {
        error('Something broke, sorry 😕');
        error((e as TractorError).message);
        throw e;
    }
}
