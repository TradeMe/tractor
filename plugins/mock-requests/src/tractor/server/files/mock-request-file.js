// Dependencies:
import { File } from '@tractor/file-structure';

export class MockRequestFile extends File {
    serialise () {
        let serialised = super.serialise();

        serialised.content = this.content;
        return serialised;
    }
}

MockRequestFile.prototype.extension = '.mock.json';
