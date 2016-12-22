// Dependencies:
import application from './application';
import tractorFileStructure from 'tractor-file-structure';

function start () {
    application.init();
    return tractorFileStructure.fileStructure.refresh()
    .then(() => application.start());
}

export default { start };
