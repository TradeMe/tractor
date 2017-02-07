import { registerFileType } from './file-types';
import { serve } from './server';

export Directory from './structure/Directory';
export File from './structure/File';
export FileStructure from './structure/FileStructure';

export default {
    registerFileType,
    serve
};
