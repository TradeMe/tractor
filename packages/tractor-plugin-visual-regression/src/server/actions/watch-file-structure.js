// Constants:
const CHANGE_DEBOUNCE_TIME = 100;

// Utilities:
import debounce from 'lodash.debounce'

let watcher;
export function watchFileStructure (fileStructure, sockets) {
    watcher = watcher || fileStructure.watch();
    watcher.on('change', debounce(() => {
        sockets.emit('visual-regression-change');
    }), CHANGE_DEBOUNCE_TIME);
}
