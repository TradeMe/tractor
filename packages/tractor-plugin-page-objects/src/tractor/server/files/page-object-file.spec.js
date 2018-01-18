/* global describe:true, it:true */

// Test setup:
import { expect, Promise, sinon } from '../../../../test-setup';

// Dependencies:
import path from 'path';
import { JavaScriptFile } from 'tractor-file-javascript';
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
});
