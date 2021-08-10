// Constants:
const REQUEST_ERROR = 400;
const IMPORT_QUERY = 'ImportDeclaration > StringLiteral';

// Dependencies:
import { File, RefactorData } from '@tractor/file-structure';
import { tsquery } from '@phenomnomnominal/tsquery';
import { createPrinter, SourceFile, StringLiteral } from 'typescript';
import * as path from 'path';
import { format } from 'prettier';
import { TYPESCRIPT_FILE_REFACTORER } from './typescript-file-refactorer';
import { TypeScriptFileMetadata, TypeScriptFileMetaType } from './typescript-file-metadata';

// Errors:
import { TractorError } from '@tractor/error-handler';

export class TypeScriptFile<MetadataType extends TypeScriptFileMetaType = TypeScriptFileMetaType> extends File {
  public ast?: SourceFile;
  public initialised = false;

  public async meta (): Promise<MetadataType | null> {
    if (!this.ast) {
      await this.read();
    }
    return this._getMetaSync();
  }

  public async read (): Promise<string> {
    const read = super.read();

    try {
      const content = await read;
      this._setAST(content);
      this._getReferences();
      return this.content!;
    } catch {
      throw new TractorError(`Parsing "${this.path}" failed.`, REQUEST_ERROR);
    }
  }

  public async refactor (type: string, data?: RefactorData): Promise<void> {
    const refactor = super.refactor(type, data);

    await refactor;
    const change = TYPESCRIPT_FILE_REFACTORER[type];
    if (change) {
      const result = await change(this, data);
      if (result === null) {
        return;
      }
    }
    await this.save(this.ast as SourceFile);
  }

  public async save (typescript: string | Buffer | SourceFile): Promise<string> {
    let toSave: string | Buffer;
    if (typeof typescript !== 'string' && !Buffer.isBuffer(typescript)) {
      const printer = createPrinter();
      toSave = printer.printFile(typescript);
      toSave = format(toSave.toString(), { printWidth: 200, singleQuote: true, parser: 'typescript' });
    } else {
      toSave = typescript;
    }

    const save = super.save(toSave);

    try {
      const content = await save;
      this._setAST(content);
      this._getReferences();
      return this.content as string;
    } catch {
      throw new TractorError(`Saving "${this.path}" failed.`, REQUEST_ERROR);
    }
  }

  public serialise (): TypeScriptFileMetadata<MetadataType> {
    const serialised = super.serialise() as TypeScriptFileMetadata<MetadataType>;

    serialised.ast = this.ast;
    return serialised;
  }

  public toJSON (): TypeScriptFileMetadata<MetadataType> {
    const json = super.toJSON() as TypeScriptFileMetadata<MetadataType>;
    json.meta = this._getMetaSync();
    return json;
  }

  private _getMetaSync (): MetadataType | null {
    try {
      return {} as MetadataType;
    } catch {
      return null;
    }
  }

  private _getReferences (): void {
    if (this.initialised) {
      this.fileStructure.referenceManager.clearReferences(this.path);
    }

    tsquery(this.ast!, IMPORT_QUERY).forEach(importPath => {
      const directoryPath = path.dirname(this.path);
      let referencePath = path.resolve(
        directoryPath,
        (importPath as StringLiteral).text
      );
      if (referencePath.endsWith('.page')) {
        referencePath = referencePath.replace('.page', '.po.js');
      }
      if (!path.extname(referencePath)) {
        referencePath = `${referencePath}${TypeScriptFile.prototype.extension}`;
      }
      const reference =
        this.fileStructure.referenceManager.getReference(referencePath);
      if (reference) {
        this.addReference(reference);
      }
    });

    this.initialised = true;
  }

  private _setAST (content: string): string {
    this.ast = tsquery.ast(content);
    return content;
  }
}

TypeScriptFile.prototype.extension = '.ts';
