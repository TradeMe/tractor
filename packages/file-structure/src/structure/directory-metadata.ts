// Dependencies:
import { FileMetadata } from './file-metadata';
import { Item } from './item';

export type DirectoryMetadata = Pick<Item, 'basename' | 'path' | 'url'> & {
    directories: Array<DirectoryMetadata>;
    files: Array<FileMetadata>;
    isDirectory: true;
};
