// Dependencies:
import application from './application';
import fileStructure from './file-structure';

function start () {
    application.init();
    return fileStructure.refresh()
    .then(() => application.start());
}

export default { start };
