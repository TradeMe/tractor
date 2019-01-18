// Utilities:
import { info, error } from '@tractor/logger';

// Dependencies:
import { init, start } from './application';

export async function server (config, di) {
    info('Starting tractor... brrrrrrmmmmmmm');

    try {
        await di.call(init);
        await di.call(start);    
    } catch (e) {
        error('Could not start tractor 🔥🔥🔥');
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
        process.exit(1);
    }
}
server['@Inject'] = ['config', 'di'];
