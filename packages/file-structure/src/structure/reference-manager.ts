// Dependencies:
import { File } from './file';
import { FileStructure } from './file-structure';

export class ReferenceManager {
    public fileStructures: Array<FileStructure> = [];
    public referencedBy: Record<string, Array<File>> = {};
    public references: Record<string, Array<File>> = {};

    public constructor (
        public fileStructure: FileStructure
    ) { }

    public addFileStructure (fileStructure: FileStructure): void {
        if (!this.fileStructures.includes(fileStructure)) {
            this.fileStructures.push(fileStructure);
            fileStructure.referenceManager.addFileStructure(this.fileStructure);
        }
    }

    public addReference (from: File, to: File): void {
        this.references[from.path] = this.references[from.path] || [];
        const references = this.references[from.path];
        if (!references.includes(to) && !this._hasFileByPath(references, to.path)) {
            references.push(to);
        }

        this.referencedBy[to.path] = this.referencedBy[to.path] || [];
        const referencedBy = this.referencedBy[to.path];
        if (!referencedBy.includes(from) && !this._hasFileByPath(referencedBy, from.path)) {
            referencedBy.push(from);
        }
    }

    public clearReferencedBy (path: string): void {
        this.getFileStructures()
        .forEach(fileStructure => {
            const { references, referencedBy } = fileStructure.referenceManager;
            referencedBy[path] = [];
            this._removeFileByPath(references, path);
        });
    }

    public clearReferences (path: string): void {
        this.getFileStructures()
        .forEach(fileStructure => {
            const { references, referencedBy } = fileStructure.referenceManager;
            references[path] = [];
            this._removeFileByPath(referencedBy, path);
        });
    }

    public getFileStructures (): Array<FileStructure> {
        return [this.fileStructure].concat(this.fileStructures);
    }

    public getReference (path: string): File | null {
        const found = this.getFileStructures()
        .find(fileStructure => !!fileStructure.allFilesByPath[path]);
        return found ? found.allFilesByPath[path] : null;
    }

    public getReferencedBy (path: string): Array<File> {
        let referencedBy: Array<File> = [];
        this.getFileStructures()
        .forEach(fileStructure => {
            referencedBy = referencedBy.concat(fileStructure.referenceManager.referencedBy[path] || []);
        });
        return referencedBy;
    }

    public getReferences (path: string): Array<File> {
        let references: Array<File> = [];
        this.getFileStructures()
        .forEach(fileStructure => {
            references = references.concat(fileStructure.referenceManager.references[path] || []);
        });
        return references;
    }

    private _hasFileByPath (references: Array<File>, path: string): boolean {
        return !!references.find(file => file.path === path);
    }

    private _removeFileByPath (references: Record<string, Array<File>>, path: string): void {
        Object.keys(references).forEach(referencePath => {
            const index = references[referencePath].findIndex(reference => reference.path === path);
            if (index >= 0) {
                references[referencePath].splice(index, 1);
            }
        });
    }
}
