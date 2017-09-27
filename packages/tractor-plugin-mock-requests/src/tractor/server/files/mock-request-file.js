// Dependencies:
import Promise from 'bluebird';
import { File } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

export class MockRequestFile extends File {
    move (update, options) {
        let { referencedBy } = this;

        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let move = super.move(update, options);

        return move.then(newFile => {
            let nameChange = {
                oldName: this.basename,
                newName: newFile.basename
            };

            return newFile.refactor('fileNameChange', nameChange)
            .then(() => {
                return Promise.map(referencedBy, reference => {
                    reference.addReference(newFile);
                    return reference.refactor('mockRequestFileNameChange', nameChange)
                    .then(() => reference.refactor('referencePathChange', {
                        fromPath: reference.path,
                        oldToPath: this.path,
                        newToPath: newFile.path
                    }));
                })
                .catch(() => {
                    throw new TractorError(`Could not update references after moving ${this.path}.`);
                });
            });
        });
    }

    serialise () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let serialised = super.serialise();

        serialised.content = this.content;
        return serialised;
    }
}

MockRequestFile.prototype.extension = '.mock.json';
