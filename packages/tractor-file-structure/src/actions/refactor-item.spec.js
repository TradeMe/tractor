/* global describe:true, it:true */

// Utilities:
import Promise from 'bluebird';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import File from '../structure/File';
import FileStructure from '../structure/FileStructure';
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { createRefactorItemHandler } from './refactor-item';

describe('tractor-file-structure - actions/refactor-item:', () => {
    it('should refactor a file', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'refactor').returns(Promise.resolve());

        let refactorItem = createRefactorItemHandler(fileStructure);
        return refactorItem(request, response)
        .then(() => {
            expect(File.prototype.refactor).to.have.been.called();
        })
        .finally(() => {
            File.prototype.refactor.restore();
        });
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

        sinon.stub(tractorErrorHandler, 'handle');

        let refactorItem = createRefactorItemHandler(fileStructure);
        refactorItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, 404));

        tractorErrorHandler.handle.restore();
    });

    it(`should respond with OK`, () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'refactor').returns(Promise.resolve());
        sinon.stub(response, 'sendStatus');

        let refactorItem = createRefactorItemHandler(fileStructure);
        return refactorItem(request, response)
        .then(() => {
            expect(response.sendStatus).to.have.been.calledWith(200);
        })
        .finally(() => {
            File.prototype.refactor.restore();
        });
    });

    it('should handle known TractorErrors', () => {
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

        sinon.stub(File.prototype, 'refactor').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        let refactorItem = createRefactorItemHandler(fileStructure);
        return refactorItem(request, response)
        .then(() => {
            expect(File.prototype.refactor).to.have.been.called();
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            File.prototype.refactor.restore();
            tractorErrorHandler.handle.restore();
        });
    });

    it('should handle unknown errors', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'refactor').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        let refactorItem = createRefactorItemHandler(fileStructure);
        return refactorItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not refactor "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));
        })
        .finally(() => {
            File.prototype.refactor.restore();
            tractorErrorHandler.handle.restore();
        });
    });
});
