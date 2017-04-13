// Utilities:
import { info } from 'tractor-logger';

// Dependencies:
import { init, start } from './application';
import { FileStructure } from 'tractor-file-structure';

export function server (config, di) {
    info('Starting tractor... brrrrrrmmmmmmm');
    let fileStructure = new FileStructure(config.directory);
    di.constant({ fileStructure });

    di.call(init)
    .then(() => fileStructure.read())
    .then(() => di.call(start));
}
server['@Inject'] = ['config', 'di'];
