// Dependencies:
import { TypeScriptFile } from '@tractor/file-javascript';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

export class PageObjectTypeScriptFile extends TypeScriptFile {
    async refactor (type, data) {
        await super.refactor(type, data);

        let change = PageObjectFileRefactorer[type];
        if (change) {
            const result = await change(this, data);
            if (result === null) {
                return;
            }
        }
        return this.save(this.ast);
    }
}

PageObjectTypeScriptFile.prototype.extension = '.page.ts';
