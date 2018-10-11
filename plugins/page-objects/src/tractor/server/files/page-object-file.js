// Dependencies:
import { JavaScriptFile } from '@tractor/file-javascript';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

export class PageObjectFile extends JavaScriptFile {
    async refactor (type, data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        await super.refactor(type, data);

        let change = PageObjectFileRefactorer[type];
        if (change) {
            await change(this, data);
        }
        return this.save(this.ast);
    }
}

PageObjectFile.prototype.extension = '.po.js';
