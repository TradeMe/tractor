// Dependencies:
import File from './File';

export default class MockDataFile extends File {
    save (data) {
        if (data) {
            this.content = data;
        }
        return super.save();
    }

    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }
}

function deleteFileReferences () {
    let { references } = this.directory.fileStructure;

    delete references[this.path];
}
