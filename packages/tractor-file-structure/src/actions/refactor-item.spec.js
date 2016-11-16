/* global describe:true, it:true */

// Constants:
import CONSTANTS from '../constants';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import File from '../structure/File';
import { fileStructure } from '../file-structure';
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { refactorItem } from './refactor-item';

describe('tractor-file-structure - actions/refactor-item:', () => {
    it('should refactor a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'refactor').returns(Promise.resolve());

        return refactorItem(request, response)
        .then(() => {
            expect(File.prototype.refactor).to.have.been.called();
        })
        .finally(() => {
            File.prototype.refactor.restore();
        });
    });

    it(`should throw an error if it can't find the file to refactor`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: { },
            params: ['/directory/missing-item']
        };
        let response = {
            send: () => { }
        };

        sinon.stub(tractorErrorHandler, 'handle');

        refactorItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));

        tractorErrorHandler.handle.restore();
    });

    it(`should respond with the updated fileStructure`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'refactor').returns(Promise.resolve());
        sinon.stub(response, 'send');

        return refactorItem(request, response)
        .then(() => {
            expect(response.send).to.have.been.calledWith(fileStructure.structure);
        })
        .finally(() => {
            File.prototype.refactor.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            send: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'refactor').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

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
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            params: [file.url]
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'refactor').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        return refactorItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not refactor "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`, CONSTANTS.SERVER_ERROR));
        })
        .finally(() => {
            File.prototype.refactor.restore();
            tractorErrorHandler.handle.restore();
        });
    });
});
