// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import { Directory } from '../structure/Directory';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';
import * as utilities from './utilities';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as tractorErrorHandler from '@tractor/error-handler';

// Under test:
import { createMoveItemHandler } from './move-item';

describe('@tractor/file-structure - actions/move-item:', () => {
    it('should move a file', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                newUrl: path.join(path.sep, 'other-directory', 'file.ext')
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'move').resolves();

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(File.prototype.move).to.have.been.calledWith({
            newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
        });

        File.prototype.move.restore();
    });

    it('should copy a file', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                copy: true
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'move').resolves();

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(File.prototype.move).to.have.been.calledWith({
            newPath: path.join(path.sep, 'file-structure', 'directory', 'file (1).ext')
        });

        File.prototype.move.restore();
    });

    it('should move a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            body: {
                newUrl: path.join(path.sep, 'other-directory')
            },
            params: [directory.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'move').resolves();

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(Directory.prototype.move).to.have.been.calledWith({
            newPath: path.join(path.sep, 'file-structure', 'other-directory')
        });

        Directory.prototype.move.restore();
    });

    it('should copy a directory', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            body: {
                copy: true
            },
            params: [directory.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'move').resolves();

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(Directory.prototype.move).to.have.been.calledWith({
            newPath: path.join(path.sep, 'file-structure', 'directory (1)')
        });

        Directory.prototype.move.restore();
    });

    it(`should respond with OK`, async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                newUrl: path.join(path.sep, 'other-directory', 'file.ext')
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'move').resolves();
        sinon.stub(response, 'sendStatus');

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(response.sendStatus).to.have.been.calledWith(200);

        File.prototype.move.restore();
    });

    it(`should throw an error if it can't find the item to move`, () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: {
                newUrl: path.join(path.sep, 'other-directory', 'missing-item')
            },
            params: ['/directory/missing-item']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(utilities, 'respondItemNotFound');

        let moveItem = createMoveItemHandler(fileStructure);
        moveItem(request, response);

        expect(utilities.respondItemNotFound).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'missing-item'), response);

        utilities.respondItemNotFound.restore();
    });

    it.skip('should handle known TractorErrors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                newUrl: path.join(path.sep, 'other-directory', 'file.ext')
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'move').rejects(error);
        sinon.stub(tractorErrorHandler, 'handleError');

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, error);

        File.prototype.move.restore();
        tractorErrorHandler.handleError.restore();
    });

    it.skip('should handle unknown errors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                newUrl: path.join(path.sep, 'other-directory', 'file.ext')
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'move').rejects();
        sinon.stub(tractorErrorHandler, 'handleError');

        let moveItem = createMoveItemHandler(fileStructure);
        await moveItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, new TractorError(`Could not move "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));
        File.prototype.move.restore();
        tractorErrorHandler.handleError.restore();
    });
});
