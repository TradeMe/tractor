// Dependencies:
import { FileMetadata } from '@tractor/file-structure';
import { SourceFile } from 'typescript';

export type TypeScriptFileMetaItem = {
  name?: string;
  version?: string;
};

export type TypeScriptFileMetaType = TypeScriptFileMetaItem & {
  [key: string]: Array<TypeScriptFileMetaItem>;
};

export type TypeScriptFileMetadata<MetaType extends TypeScriptFileMetaType = TypeScriptFileMetaType> = FileMetadata & {
  ast?: SourceFile;
  meta: MetaType | null;
};
