// Dependencies:
import application from './application';
import * as fileStructure from './file-structure';

export function start () {
    return fileStructure.refresh()
    .then(() => application.start());
}

export config from './config/config';
