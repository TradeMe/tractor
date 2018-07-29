// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { JavaScriptFile } from '@tractor/file-javascript';
import { FileStructure } from '@tractor/file-structure';
import path from 'path';
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

// Under test:
import { PageObjectFile } from './page-object-file';

describe('@tractor-plugins/page-objects - page-object-file:', () => {
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
        it('should refactor a PageObject file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(PageObjectFile.prototype, 'save').resolves();

            let file = new PageObjectFile(filePath, fileStructure);

            await file.refactor('refactor');

            expect(JavaScriptFile.prototype.refactor).to.have.been.calledWith('refactor');

            JavaScriptFile.prototype.refactor.restore();
            PageObjectFile.prototype.save.restore();
        });

        it('should call the appropriate action on the PageObjectFileRefactorer', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(PageObjectFile.prototype, 'save').resolves();
            sinon.stub(PageObjectFileRefactorer, 'fileNameChange');

            let file = new PageObjectFile(filePath, fileStructure);
            let data = {};

            await file.refactor('fileNameChange', data);

            expect(PageObjectFileRefactorer.fileNameChange).to.have.been.calledWith(file, data);

            JavaScriptFile.prototype.refactor.restore();
            PageObjectFile.prototype.save.restore();
            PageObjectFileRefactorer.fileNameChange.restore();
        });

        it(`should do nothing if the action doesn't exist the PageObjectFileRefactorer`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(PageObjectFile.prototype, 'save').resolves();

            let file = new PageObjectFile(filePath, fileStructure);
            let data = {};

            try {
                await file.refactor('someRefactorAction', data);

                JavaScriptFile.prototype.refactor.restore();
                PageObjectFile.prototype.save.restore();
            } catch (error) {
                throw error;
            }
        });

        it('should save the PageObjectFile file after it has been refactored', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(PageObjectFile.prototype, 'save').resolves();

            let file = new PageObjectFile(filePath, fileStructure);

            await file.refactor('refactor');

            expect(PageObjectFile.prototype.save).to.have.been.called();

            JavaScriptFile.prototype.refactor.restore();
            PageObjectFile.prototype.save.restore();
        });
    });
});
