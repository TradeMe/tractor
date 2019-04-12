// Dependencies:
import { error, info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';
import { init, start } from './application';

export async function serve (tractor: Tractor): Promise<void> {
    info('Starting tractor... brrrrrrmmmmmmm');

    try {
        const server = await init(tractor);
        await start(tractor, server);
    } catch (e) {
        error('Could not start tractor 🔥🔥🔥');
        // tslint:disable-next-line:no-console
        console.error(e);
        process.exit(1);
    }
}
