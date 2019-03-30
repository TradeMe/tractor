// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { TractorError } from '@tractor/error-handler';
import { error, info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';
import { copyProtractorConfig } from './copy-protractor-config';
import { createTractorDirectory } from './create-tractor-directory';
import { initialisePlugins } from './initialise-plugins';

export const init = inject(async (tractor: Tractor): Promise<void> => {
    info('Setting up tractor...');

    try {
        await tractor.call(createTractorDirectory);
        await tractor.call(copyProtractorConfig);
        await tractor.call(initialisePlugins);
        info('Set up complete!');
    } catch (e) {
        error('Something broke, sorry 😕');
        error((e as TractorError).message);
        throw e;
    }
}, 'tractor');
