// Constants:
const CHANGE_DEBOUNCE_TIME = 100;

// Dependencies:
import debounce from 'lodash.debounce'

export function watchFileStructure (fileStructure, sockets) {
    fileStructure.watcher = fileStructure.watcher || fileStructure.watch();
    fileStructure.watcher.on('change', debounce(() => {
        sockets.emit('file-structure-change');
    }), CHANGE_DEBOUNCE_TIME);
}
