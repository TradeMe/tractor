'use strict';

// Dependencies:
import { FileStructureItem } from './file-structure-item.interface';

export interface Directory extends FileStructureItem {
    allFiles: Array<FileStructureItem>;
    directories: Array<Directory>;
    files: Array<FileStructureItem>;
    open: boolean;
}
