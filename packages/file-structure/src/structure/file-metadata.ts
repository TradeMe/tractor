// Dependencies:
import { File } from './file';
import { Item } from './item';

export type FileMetadata = Pick<Item, 'basename' | 'path' | 'url'> & Pick<File, 'extension'> & {
    referencedBy?: Array<FileMetadata>;
    references?: Array<FileMetadata>;
};
