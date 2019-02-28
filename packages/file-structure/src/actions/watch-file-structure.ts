// Dependencies:
import { Namespace } from 'socket.io';
import { Directory } from '../structure/directory';
import { FileStructure } from '../structure/file-structure';

export function watchFileStructure (fileStructure: FileStructure, sockets: Namespace): void {
    fileStructure.watcher = fileStructure.watcher || fileStructure.watch();
    fileStructure.watcher.on('change', (changeDirectory: Directory) => {
        sockets.emit('file-structure-change', changeDirectory.url);
    });
}
