// Dependencies:
import { fileStructure } from '../file-structure';

let watcher;
export function watchFileStructure (socket) {
    watcher = watcher || fileStructure.watch();
    watcher.on('change', () => {
        socket.emit('file-structure-change');
    });
}
