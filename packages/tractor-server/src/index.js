// Utilities:
import { info } from 'tractor-logger';

// Dependencies:
import { init, start } from './application';

export function server (config, di) {
    info('Starting tractor... brrrrrrmmmmmmm');

    di.call(init)
    .then(() => di.call(start));
}
server['@Inject'] = ['config', 'di'];
