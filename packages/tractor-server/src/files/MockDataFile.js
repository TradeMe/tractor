// Utilities:
import changeCase from 'change-case';
import path from 'path';

// Dependencies:
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';
import transforms from '../api/transformers/transforms';

export default class MockDataFile extends File {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }

    move (update, options) {
        return super.move(update, options)
        .then(() => {
            let { oldPath, newPath } = update;
            if (oldPath && newPath) {
                let oldName = path.basename(oldPath, this.extension);
                let newName = path.basename(newPath, this.extension);

                console.log(oldName, newName, oldPath, newPath);

                return transforms.transformReferences('mockData', oldPath, newPath, oldName, newName)
                .then(() => transforms.transformReferenceIdentifiers(newPath, changeCase.camel(oldName), changeCase.camel(newName)));
            }
        })
    }

    save (data) {
        return super.save(data);
    }

    serialise () {
        let serialised = super.serialise();
        serialised.content = this.content;
        return serialised;
    }
}

MockDataFile.prototype.extension = '.mock.json';
MockDataFile.prototype.type = 'mock-data';

function deleteFileReferences () {
    debugger;
    let { references } = this.fileStructure;

    delete references[this.path];
}

tractorFileStructure.registerFileType(MockDataFile);
