/* global describe:true, it:true, xit:true */

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import { Directory } from '../structure/Directory';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';
import * as utilities from './utilities';

// Errors:
import { TractorError } from '@tractor/error-handler';
import * as tractorErrorHandler from '@tractor/error-handler';

// Under test:
import { createDeleteItemHandler } from './delete-item';

describe('@tractor/file-structure - actions/delete-item:', () => {
    it('should delete a file', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').resolves();

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(File.prototype.delete).to.have.been.called();

        File.prototype.delete.restore();
    });

    it('should delete a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'delete').resolves();

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(Directory.prototype.delete).to.have.been.called();

        Directory.prototype.delete.restore();
    });

    it(`should throw an error if it can't find the item to delete`, () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

        let request = {
            params: ['/directory/missing-item'],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(utilities, 'respondItemNotFound');

        let deleteItem = createDeleteItemHandler(fileStructure);
        deleteItem(request, response);

        expect(utilities.respondItemNotFound).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'missing-item'), response);

        utilities.respondItemNotFound.restore();
    });

    it('should rimraf a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: {
                rimraf: true
            }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'rimraf').resolves();

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(Directory.prototype.rimraf).to.have.been.called();

        Directory.prototype.rimraf.restore();
    });

    it(`should respond with OK`, async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').resolves();
        sinon.stub(response, 'sendStatus');

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(response.sendStatus).to.have.been.calledWith(200);

        File.prototype.delete.restore();
    });

    it('should fall back to delete if `rimraf` is passed but the item is not a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: {
                rimraf: true
            }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').resolves();

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(File.prototype.delete).to.have.been.called();

        File.prototype.delete.restore();
    });

    it('should cleanup a file', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: {
                cleanup: true
            }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'cleanup').resolves();

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(File.prototype.cleanup).to.have.been.called();

        File.prototype.cleanup.restore();
    });

    it('should cleanup a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: {
                cleanup: true
            }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'cleanup').resolves();

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(Directory.prototype.cleanup).to.have.been.called();

        Directory.prototype.cleanup.restore();
    });

    it.skip('should handle known TractorErrors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'delete').rejects(error);
        sinon.stub(tractorErrorHandler, 'handleError');

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(File.prototype.delete).to.have.been.called();
        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, error);

        File.prototype.delete.restore();
        tractorErrorHandler.handleError.restore();
    });

    it.skip('should handle unknown errors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').rejects();
        sinon.stub(tractorErrorHandler, 'handleError');

        let deleteItem = createDeleteItemHandler(fileStructure);
        await deleteItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, new TractorError(`Could not delete "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));

        File.prototype.delete.restore();
        tractorErrorHandler.handleError.restore();
    });
});
