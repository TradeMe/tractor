// Utilities:
import { info } from 'tractor-logger';

// Dependencies:
import application from './application';
import tractorFileStructure from 'tractor-file-structure';

function start () {
    info('Starting tractor... brrrrrrmmmmmmm');
    application.init();
    return tractorFileStructure.fileStructure.refresh()
    .then(() => application.start());
}

export default { start };
