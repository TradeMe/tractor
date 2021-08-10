// Dependencies:
import { TypeScriptFile } from '@tractor/file-javascript';
import { MochaSpecFileRefactorer } from './mocha-spec-file-refactorer';

export class MochaSpecTypeScriptFile extends TypeScriptFile {
    async refactor (type, data) {
        await super.refactor(type, data);

        let change = MochaSpecFileRefactorer[type];
        if (change) {
            const result = await change(this, data);
            if (result === null) {
                return;
            }
        }
        return this.save(this.ast);
    }
}

MochaSpecTypeScriptFile.prototype.extension = '.e2e.spec.ts';
