// Dependencies:
import Promise from 'bluebird';
import { JavaScriptFile } from 'tractor-file-javascript';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

// Errors:
import { TractorError } from 'tractor-error-handler';

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

    move (update, options) {
        let references = this.fileStructure.references.getReferencesTo(this.path);

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
                return Promise.map(references, reference => {
                    this.fileStructure.references.addReference(newFile, reference);
                    return reference.refactor('pageObjectFileNameChange', nameChange)
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
}

PageObjectFile.prototype.extension = '.po.js';
