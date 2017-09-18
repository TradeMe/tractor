/* global describe:true, it:true */

// Test setup:
import { expect, Promise, sinon } from '../../../../test-setup';

// Dependencies:
import path from 'path';
import { JavaScriptFile } from 'tractor-file-javascript';
import { TractorError } from 'tractor-error-handler';
import { FileStructure } from 'tractor-file-structure';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

// Under test:
import { PageObjectFile } from './page-object-file';

describe('tractor-plugin-page-objects - page-object-file:', () => {
    describe('PageObjectFile constructor:', () => {
        it('should create a new PageObjectFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new PageObjectFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(PageObjectFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new PageObjectFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });

        it('should have an `extension` of ".po.js"', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new PageObjectFile(filePath, fileStructure);

            expect(file.extension).to.equal('.po.js');
        });
    });

    describe('PageObjectFile.refactor:', () => {
        it('should refactor a PageObject file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').returns(Promise.resolve());
            sinon.stub(PageObjectFile.prototype, 'save').returns(Promise.resolve());

            let file = new PageObjectFile(filePath, fileStructure);

            return file.refactor('refactor')
            .then(() => {
                expect(JavaScriptFile.prototype.refactor).to.have.been.calledWith('refactor');
            })
            .finally(() => {
                JavaScriptFile.prototype.refactor.restore();
                PageObjectFile.prototype.save.restore();
            });
        });

        it('should call the appropriate action on the PageObjectFileRefactorer', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').returns(Promise.resolve());
            sinon.stub(PageObjectFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(PageObjectFileRefactorer, 'fileNameChange');

            let file = new PageObjectFile(filePath, fileStructure);
            let data = {};

            return file.refactor('fileNameChange', data)
            .then(() => {
                expect(PageObjectFileRefactorer.fileNameChange).to.have.been.calledWith(file, data);
            })
            .finally(() => {
                JavaScriptFile.prototype.refactor.restore();
                PageObjectFile.prototype.save.restore();
                PageObjectFileRefactorer.fileNameChange.restore();
            });
        });

        it(`should do nothing if the action doesn't exist the PageObjectFileRefactorer`, done => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').returns(Promise.resolve());
            sinon.stub(PageObjectFile.prototype, 'save').returns(Promise.resolve());

            let file = new PageObjectFile(filePath, fileStructure);
            let data = {};

            file.refactor('someRefactorAction', data)
            .then(done)
            .catch(done.fail)
            .finally(() => {
                JavaScriptFile.prototype.refactor.restore();
                PageObjectFile.prototype.save.restore();
            });
        });

        it('should save the PageObjectFile file after it has been refactored', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').returns(Promise.resolve());
            sinon.stub(PageObjectFile.prototype, 'save').returns(Promise.resolve());

            let file = new PageObjectFile(filePath, fileStructure)

            return file.refactor('refactor')
            .then(() => {
                expect(PageObjectFile.prototype.save).to.have.been.called();
            })
            .finally(() => {
                JavaScriptFile.prototype.refactor.restore();
                PageObjectFile.prototype.save.restore();
            });
        });
    });

    describe('PageObjectFile.move:', () => {
        it('should move the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.po.js');
            let file = new PageObjectFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.po.js');
            let newFile = new PageObjectFile(newFilePath, fileStructure);

            sinon.stub(JavaScriptFile.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(PageObjectFile.prototype, 'refactor').returns(Promise.resolve());

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(JavaScriptFile.prototype.move).to.have.been.calledWith(update, options);
            })
            .finally(() => {
                JavaScriptFile.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                PageObjectFile.prototype.refactor.restore();
            });
        });

        it('should update the name of the page object in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.po.js');
            let file = new PageObjectFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.po.js');
            let newFile = new PageObjectFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.po.js');
            let referenceFile = new PageObjectFile(referenceFilePath, fileStructure);

            sinon.stub(fileStructure.references, 'getReferencesTo').returns([referenceFile]);
            sinon.stub(JavaScriptFile.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(PageObjectFile.prototype, 'refactor').returns(Promise.resolve());

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(referenceFile.refactor).to.have.been.calledWith('pageObjectFileNameChange', {
                    oldName: 'file',
                    newName: 'new file'
                });
            })
            .finally(() => {
                JavaScriptFile.prototype.move.restore();
                PageObjectFile.prototype.refactor.restore();
            });
        });

        it('should update the require path to the page object in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.po.js');
            let file = new PageObjectFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.po.js');
            let newFile = new PageObjectFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.po.js');
            let referenceFile = new PageObjectFile(referenceFilePath, fileStructure);

            sinon.stub(fileStructure.references, 'getReferencesTo').returns([referenceFile]);
            sinon.stub(JavaScriptFile.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(PageObjectFile.prototype, 'refactor').returns(Promise.resolve());

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(referenceFile.refactor).to.have.been.calledWith('referencePathChange', {
                    fromPath: referenceFilePath,
                    oldToPath: filePath,
                    newToPath: newFilePath
                });
            })
            .finally(() => {
                JavaScriptFile.prototype.move.restore();
                PageObjectFile.prototype.refactor.restore();
            });
        });

        it('should throw if updating references fails', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.po.js');
            let file = new PageObjectFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.po.js');
            let newFile = new PageObjectFile(newFilePath, fileStructure);

            sinon.stub(JavaScriptFile.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(PageObjectFile.prototype, 'refactor').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.reject());

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Could not update references after moving ${filePath}.`));
            })
            .finally(() => {
                JavaScriptFile.prototype.move.restore();
                PageObjectFile.prototype.refactor.restore();
                Promise.map.restore();
            });
        });
    });
});
