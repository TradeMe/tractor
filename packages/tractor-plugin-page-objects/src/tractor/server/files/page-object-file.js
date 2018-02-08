// Dependencies:
import { JavaScriptFile } from '@tractor/file-javascript';
import Promise from 'bluebird';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

export class PageObjectFile extends JavaScriptFile {
    refactor (type, data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let refactor = super.refactor(type, data);

        return refactor.then(() => {
            let change = PageObjectFileRefactorer[type];
            return change ? change(this, data) : Promise.resolve();
        })
        .then(() => this.save(this.ast));
    }
}

PageObjectFile.prototype.extension = '.po.js';
