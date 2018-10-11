// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';
import * as utilities from './utilities';

// Errors:
import { TractorError } from '@tractor/error-handler';
import * as tractorErrorHandler from '@tractor/error-handler';

// Under test:
import { createRefactorItemHandler } from './refactor-item';

describe('@tractor/file-structure - actions/refactor-item:', () => {
    it('should refactor a file', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'refactor').resolves();

        let refactorItem = createRefactorItemHandler(fileStructure);
        await refactorItem(request, response);

        expect(File.prototype.refactor).to.have.been.called();

        File.prototype.refactor.restore();
    });

    it(`should throw an error if it can't find the file to refactor`, () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: { },
            params: ['/directory/missing-item']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(utilities, 'respondItemNotFound');

        let refactorItem = createRefactorItemHandler(fileStructure);
        refactorItem(request, response);

        expect(utilities.respondItemNotFound).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'missing-item'), response);

        utilities.respondItemNotFound.restore();
    });

    it(`should respond with OK`, async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'refactor').resolves();
        sinon.stub(response, 'sendStatus');

        let refactorItem = createRefactorItemHandler(fileStructure);
        await refactorItem(request, response);

        expect(response.sendStatus).to.have.been.calledWith(200);

        File.prototype.refactor.restore();
    });

    it.skip('should handle known TractorErrors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'refactor').rejects(error);
        sinon.stub(tractorErrorHandler, 'handleError');

        let refactorItem = createRefactorItemHandler(fileStructure);
        await refactorItem(request, response);

        expect(File.prototype.refactor).to.have.been.called();
        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, error);

        File.prototype.refactor.restore();
        tractorErrorHandler.handleError.restore();
    });

    it.skip('should handle unknown errors', async () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'refactor').rejects();
        sinon.stub(tractorErrorHandler, 'handleError');

        let refactorItem = createRefactorItemHandler(fileStructure);
        await refactorItem(request, response);

        expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, new TractorError(`Could not refactor "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));

        File.prototype.refactor.restore();
        tractorErrorHandler.handleError.restore();
    });
});
