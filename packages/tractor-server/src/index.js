// Utilities:
import { info } from 'tractor-logger';

// Dependencies:
import application from './application';
import { getConfig } from 'tractor-config-loader';
import { FileStructure } from 'tractor-file-structure';

function start () {
    info('Starting tractor... brrrrrrmmmmmmm');
    let config = getConfig();
    let fileStructure = new FileStructure(config.testDirectory);

    application.init(fileStructure)
    .then(() => fileStructure.read())
    .then(() => application.start());
}

export default { start };
