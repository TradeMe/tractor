// Dependencies:
import { JavaScriptFile } from '@tractor/file-javascript';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

export class PageObjectFile extends JavaScriptFile {
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

PageObjectFile.prototype.extension = '.po.js';
