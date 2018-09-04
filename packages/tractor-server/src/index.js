// Utilities:
import { info } from '@tractor/logger';

// Dependencies:
import { init, start } from './application';

export async function server (config, di) {
    info('Starting tractor... brrrrrrmmmmmmm');

    await di.call(init);
    await di.call(start);
}
server['@Inject'] = ['config', 'di'];
