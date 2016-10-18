/* global describe:true, it:true */

// Constants:
import CONSTANTS from '../constants';

// Utilities:
import chai from 'chai';
import path from 'path';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import Directory from '../structure/Directory';
import File from '../structure/File';
import { fileStructure } from '../file-structure';
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { deleteItem } from './delete-item';

describe('tractor-file-structure - actions/delete-item:', () => {
    it('should delete a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);

        let request = {
            query: { },
            url: '/fs/directory/file'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(file, 'delete').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(file.delete).to.have.been.called();
        });
    });

    it('should delete a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            query: { },
            url: '/fs/directory'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(directory, 'delete').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(directory.delete).to.have.been.called();
        });
    });

    it(`should throw an error if it can't find the item to delete`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            query: { },
            url: '/fs/directory/missing-item'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(tractorErrorHandler, 'handle');

        deleteItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));

        tractorErrorHandler.handle.restore();
    });

    it('should handle known TractorErrors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);
        let request = {
            query: { },
            url: '/fs/directory/file'
        };
        let response = {
            send: () => { }
        };
        let error = new TractorError();

        sinon.stub(file, 'delete').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        return deleteItem(request, response)
        .then(() => {
            expect(file.delete).to.have.been.called();
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            tractorErrorHandler.handle.restore();
        });
    });

    it('should handle unknown errors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);
        let request = {
            query: { },
            url: '/fs/directory/file'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(file, 'delete').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        return deleteItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not delete "${path.join(path.sep, 'file-structure', 'directory', 'file')}"`, CONSTANTS.SERVER_ERROR));
        })
        .finally(() => {
            tractorErrorHandler.handle.restore();
        });
    });
});
