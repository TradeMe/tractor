// Dependencies:
import { File } from '@tractor/file-structure';

export class MockRequestFile extends File {
    serialise () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let serialised = super.serialise();

        serialised.content = this.content;
        return serialised;
    }
}

MockRequestFile.prototype.extension = '.mock.json';
