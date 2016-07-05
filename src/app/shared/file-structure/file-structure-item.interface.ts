'use strict';

export interface FileStructureItem {
    ast?: ESCodeGen.Program;
    editingName: boolean;
    isDirectory: boolean;
    name: string;
    path: string;
    previousName: string;
    showActions: boolean;
}
