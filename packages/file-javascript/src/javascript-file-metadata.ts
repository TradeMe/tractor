// Dependencies:
import { FileMetadata } from '@tractor/file-structure';
import { Program } from 'esprima';

export type JavaScriptFileMetaItem = {
    name?: string;
    version?: string;
};

export type JavaScriptFileMetaType = JavaScriptFileMetaItem & {
    [key: string]: Array<JavaScriptFileMetaItem>;
};

export type JavaScriptFileMetadata<MetaType extends JavaScriptFileMetaType = JavaScriptFileMetaType> = FileMetadata & {
    ast?: Program;
    meta: MetaType | null;
};
