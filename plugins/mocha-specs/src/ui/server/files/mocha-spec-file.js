// Dependencies:
import { JavaScriptFile } from '@tractor/file-javascript';
import { MochaSpecFileRefactorer } from './mocha-spec-file-refactorer';

export class MochaSpecFile extends JavaScriptFile {
    async refactor (type, data) {
        await super.refactor(type, data);

        let change = MochaSpecFileRefactorer[type];
        if (change) {
            await change(this, data);
        }
        return this.save(this.ast);
    }
}

MochaSpecFile.prototype.extension = '.e2e-spec.js';
