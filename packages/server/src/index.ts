// Dependencies:
import { inject } from '@tractor/dependency-injection';
import { error, info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';
import { init, start } from './application';

export const server = inject(async (tractor: Tractor): Promise<void> => {
    info('Starting tractor... brrrrrrmmmmmmm');

    try {
        await tractor.call(init);
        await tractor.call(start);
    } catch (e) {
        error('Could not start tractor 🔥🔥🔥');
        // tslint:disable-next-line:no-console
        console.error(e);
        process.exit(1);
    }
}, 'tractor');
