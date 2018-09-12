// Test setup:
import { expect, NOOP, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import { Directory } from '../structure/Directory';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';

// Errors:
import { TractorError } from '@tractor/error-handler';
import * as tractorErrorHandler from '@tractor/error-handler';

// Under test:
import { createSaveItemHandler } from './save-item';

describe('@tractor/file-structure - actions/save-item:', () => {
    it('should save a file', async () => {
        class TestFile extends File {
            save () { }
        }
        TestFile.prototype.extension = '.ext';

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        fileStructure.addFileType(TestFile);
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'save').resolves();
        sinon.stub(TestFile.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(TestFile.prototype.save).to.have.been.calledWith('data');

        Directory.prototype.save.restore();
    });

    it('should save a new file with multiple extensions', async () => {
        class SpecialTestFile extends File {
            save () { }
        }
        SpecialTestFile.prototype.extension = '.special.ext';

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        fileStructure.addFileType(SpecialTestFile);
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.special.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(SpecialTestFile.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(SpecialTestFile.prototype.save).to.have.been.calledWith('data');
    });

    it.skip('should throw if it is an unknown file type', async () => {
        const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        const filePath = '/directory/file.ext';
        const request = {
            body: {
                data: 'data'
            },
            params: [filePath]
        };
        const response = {
            send: NOOP,
            status: NOOP
        };
        sinon.stub(tractorErrorHandler, 'handleError');

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, new TractorError(`Could not save "${path.join(fileStructure.path, filePath)}" as it is not a supported file type.`));

        tractorErrorHandler.handleError.restore();
    });

    it('should save a copy of a file if it already exists', async () => {
        class TestFile extends File {
            save () { }
        }
        TestFile.prototype.extension = '.ext';

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        fileStructure.addFileType(TestFile);
        let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                data: 'data'
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.spy(file, 'save');
        sinon.stub(TestFile.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(file.save).to.not.have.been.called();
        expect(TestFile.prototype.save).to.have.been.calledWith('data');
    });

    it('should overwrite an existing file', async () => {
        class TestFile extends File {
            save () { }
        }
        TestFile.prototype.extension = '.ext';

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        fileStructure.addFileType(TestFile);
        let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                data: 'data',
                overwrite: true
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(TestFile.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(TestFile.prototype.save).to.have.been.calledWith('data');
    });

    it('should save a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: { },
            params: ['/directory']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(Directory.prototype.save).to.have.been.called();

        Directory.prototype.save.restore();
    });

    it('should save a copy of a directory if it already exists', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let request = {
            body: { },
            params: [directory.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.spy(directory, 'save');
        sinon.stub(Directory.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(directory.save).to.not.have.been.called();
        expect(Directory.prototype.save).to.have.been.called();

        Directory.prototype.save.restore();
    });

    it('should overwrite an existing directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let request = {
            body: {
              overwrite: true
            },
            params: [directory.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'save').resolves();

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(Directory.prototype.save).to.have.been.called();

        Directory.prototype.save.restore();
    });

    it.skip('should handle known TractorErrors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let error = new TractorError();
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'save').rejects();
        sinon.stub(tractorErrorHandler, 'handleError');

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, error);

        File.prototype.save.restore();
        tractorErrorHandler.handleError.restore();
    });

    it.skip('should handle unknown errors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'save').rejects();
        sinon.stub(tractorErrorHandler, 'handleError');

        let saveItem = createSaveItemHandler(fileStructure);
        await saveItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, new TractorError(`Could not save "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));

        File.prototype.save.restore();
        tractorErrorHandler.handleError.restore();
    });
});
