// Dependencies:
import { Directory } from './directory';
import { FileStructure } from './file-structure';

export type Item = {
    basename: string;
    directory?: Directory;
    fileStructure: FileStructure;
    name: string;
    path: string;
    url: string;

    delete (options?: ItemDeleteOptions): Promise<Item | void>;
    move (update: ItemMoveUpdate, options?: ItemDeleteOptions): Promise<Item | void>;
};

export type ItemMoveUpdate = {
    newPath: string;
    oldPath?: string;
};

export type ItemDeleteOptions = {
    isCopy?: boolean;
    isMove?: boolean;
};
