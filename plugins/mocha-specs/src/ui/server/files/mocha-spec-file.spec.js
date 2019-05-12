// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { JavaScriptFile } from '@tractor/file-javascript';
import { FileStructure } from '@tractor/file-structure';
import path from 'path';
import { MochaSpecFileRefactorer } from './mocha-spec-file-refactorer';

// Under test:
import { MochaSpecFile } from './mocha-spec-file';

describe('@tractor-plugins/mocha-spec - mocha-spec-file:', () => {
    describe('MochaSpecFile constructor:', () => {
        it('should create a new PageObjectFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            let file = new MochaSpecFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(MochaSpecFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            let file = new MochaSpecFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });

        it('should have an `extension` of ".e2e-spec.js"', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            let file = new MochaSpecFile(filePath, fileStructure);

            expect(file.extension).to.equal('.e2e-spec.js');
        });
    });

    describe('MochaSpecFile.refactor:', () => {
        it('should refactor a MochaSpec file', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(MochaSpecFile.prototype, 'save').resolves();

            let file = new MochaSpecFile(filePath, fileStructure);

            await file.refactor('refactor');

            expect(JavaScriptFile.prototype.refactor).to.have.been.calledWith('refactor');

            JavaScriptFile.prototype.refactor.restore();
            MochaSpecFile.prototype.save.restore();
        });

        it('should call the appropriate action on the MochaSpecFileRefactorer', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(MochaSpecFile.prototype, 'save').resolves();
            sinon.stub(MochaSpecFileRefactorer, 'fileNameChange');

            let file = new MochaSpecFile(filePath, fileStructure);
            let data = {};

            await file.refactor('fileNameChange', data);

            expect(MochaSpecFileRefactorer.fileNameChange).to.have.been.calledWith(file, data);

            JavaScriptFile.prototype.refactor.restore();
            MochaSpecFile.prototype.save.restore();
            MochaSpecFileRefactorer.fileNameChange.restore();
        });

        it(`should do nothing if the action doesn't exist the MochaSpecFileRefactorer`, async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(MochaSpecFile.prototype, 'save').resolves();

            let file = new MochaSpecFile(filePath, fileStructure);
            let data = {};

            try {
                await file.refactor('someRefactorAction', data);

                JavaScriptFile.prototype.refactor.restore();
                MochaSpecFile.prototype.save.restore();
            } catch (error) {
                throw error;
            }
        });

        it('should save the MochaSpecFile file after it has been refactored', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js');

            sinon.stub(JavaScriptFile.prototype, 'refactor').resolves();
            sinon.stub(MochaSpecFile.prototype, 'save').resolves();

            let file = new MochaSpecFile(filePath, fileStructure);

            await file.refactor('refactor');

            expect(MochaSpecFile.prototype.save.callCount > 0).to.equal(true);

            JavaScriptFile.prototype.refactor.restore();
            MochaSpecFile.prototype.save.restore();
        });
    });
});
