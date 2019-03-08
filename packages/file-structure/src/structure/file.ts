// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { pathToUrl } from '../utilities';
import { Directory } from './directory';
import { FileMetadata } from './file-metadata';
import { FileStructure } from './file-structure';
import { Item, ItemDeleteOptions, ItemMoveUpdate } from './item';
import { RefactorData } from './refactorer';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

export class File implements Item {
    public basename: string;
    public buffer: Buffer | null = null;
    public content: string | null = null;
    public directory!: Directory;
    public extension: string;
    public name: string;
    public path: string;
    public url: string;

    private _modifyTime?: number;

    public constructor (
        filePath: string,
        public fileStructure: FileStructure
    ) {
        this.path = path.resolve(process.cwd(), filePath);

        const isWithinRoot = this.path.indexOf(`${fileStructure.path}${path.sep}`) === 0;

        if (!isWithinRoot) {
            throw new TractorError(`Cannot create "${this.path}" because it is outside of the root of the FileStructure`);
        }

        if (fileStructure.allFilesByPath[this.path]) {
            throw new TractorError(`Cannot create "${this.path}" because it already exists`);
        }

        this.name = path.basename(this.path);
        this.extension = (this.constructor.prototype as File).extension || path.extname(this.path);
        this.basename = path.basename(this.path, this.extension);

        const relativePath = path.relative(this.fileStructure.path, this.path);
        this.url = pathToUrl(this.fileStructure, relativePath);

        const parentPath = path.dirname(this.path);
        const parent = fileStructure.allDirectoriesByPath[parentPath];
        this.directory = parent ? parent : new Directory(parentPath, fileStructure);
        this.directory.addItem(this);
    }

    public get references (): Array<File> {
        return this.fileStructure.referenceManager.getReferences(this.path);
    }

    public get referencedBy (): Array<File> {
        return this.fileStructure.referenceManager.getReferencedBy(this.path);
    }

    public addReference (reference: File): void {
        this.fileStructure.referenceManager.addReference(this, reference);
    }

    public async cleanup (): Promise<void> {
        await this.delete();
        return this.directory.cleanup();
    }

    public clearReferences (): void {
        this.fileStructure.referenceManager.clearReferences(this.path);
        this.fileStructure.referenceManager.clearReferencedBy(this.path);
    }

    public async delete (options: ItemDeleteOptions = { }): Promise<void> {
        const { isMove } = options;

        if (!isMove && this.referencedBy.length) {
            throw new TractorError(`Cannot delete "${this.path}" as it is referenced by another file.`);
        }

        try {
            await unlink(this.path);
            this.directory.removeItem(this);
            this.fileStructure.referenceManager.clearReferences(this.path);
        } catch {
            throw new TractorError(`Cannot delete "${this.path}". Something went wrong.`);
        }
    }

    public async move (update: ItemMoveUpdate, options: ItemDeleteOptions = { }): Promise<void> {
        const { isCopy } = options;
        update.oldPath = this.path;

        const fileConstructor = this.constructor as typeof File;
        const newFile = new fileConstructor(update.newPath, this.fileStructure);

        options.isMove = true;
        const save = newFile.save(this.buffer!);

        if (isCopy) {
            await save;
            return;
        }

        const { referencedBy, references } = this;
        this.clearReferences();

        const nameChange = {
            newName: newFile.basename,
            oldName: this.basename
        };

        await save;
        await this.delete(options);
        await newFile.refactor('fileNameChange', nameChange);
        try {
            await Promise.all(referencedBy.map(async reference => {
                const { extension } = reference;
                const referenceNameChange = {
                    ...nameChange,
                    extension
                };
                const referencePathChange = {
                    fromPath: reference.path,
                    newToPath: newFile.path,
                    oldToPath: this.path
                };
                reference.addReference(newFile);
                await reference.refactor('referenceNameChange', referenceNameChange);
                return reference.refactor('referencePathChange', referencePathChange);
            }));
            await Promise.all(references.map(async reference => {
                const referencePathChange = {
                    newFromPath: newFile.path,
                    oldFromPath: this.path,
                    toPath: reference.path
                };
                newFile.addReference(reference);
                return newFile.refactor('referencePathChange', referencePathChange);
            }));
        } catch {
            throw new TractorError(`Could not update references after moving "${this.path}".`);
        }
    }

    public async read (): Promise<string> {
        const { mtimeMs } = await stat(this.path);
        if (this._modifyTime && mtimeMs <= this._modifyTime) {
            return this.content!;
        }
        try {
            const buffer = await readFile(this.path);
            this._setData(buffer, mtimeMs);
            return this.content!;
        } catch {
            throw new TractorError(`Cannot read "${this.path}". Something went wrong.`);
        }
    }

    public async refactor (_: string, __: RefactorData): Promise<void> {
        return Promise.resolve();
    }

    public async save (data: string | Buffer): Promise<string> {
        await this.directory.save();
        try {
            await writeFile(this.path, data);
            const { mtimeMs } = await stat(this.path);
            this._setData(Buffer.from(data as string), mtimeMs);
            return this.content!;
        } catch {
            throw new TractorError(`Cannot save "${this.path}". Something went wrong.`);
        }
    }

    public serialise (): FileMetadata {
        return this.toJSON();
    }

    public toJSON (): FileMetadata {
        const references = this.references.map(ref => this._getFileDetails(ref));
        const referencedBy = this.referencedBy.map(ref => this._getFileDetails(ref));
        const details = this._getFileDetails(this);
        return { references, referencedBy, ...details };
    }

    private _getFileDetails (file: File): FileMetadata {
        return {
            basename: file.basename,
            extension: file.extension,
            path: file.path,
            url: file.url
        };
    }

    private _setData (data: Buffer, modifyTime: number): void {
        this.buffer = data;
        this.content = this.buffer.toString();
        this._modifyTime = modifyTime;
    }
}
