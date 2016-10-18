// Dependencies:
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';

export default class MockDataFile extends File {
    save (json) {
        return super.save(json);
    }

    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }

    serialise () {
        let serialised = super.serialise();
        serialised.content = this.content;
        return serialised;
    }
}

MockDataFile.extension = '.mock.json';
MockDataFile.type = 'mock-data';

function deleteFileReferences () {
    let { references } = this.fileStructure;

    delete references[this.path];
}

tractorFileStructure.registerFileType(MockDataFile);
