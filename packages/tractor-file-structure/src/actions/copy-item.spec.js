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
import { copyItem } from './copy-item';

describe('tractor-file-structure - actions/copy-item:', () => {
    it('should copy a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);
        file.content = 'content';

        let request = {
            url: '/fs/directory/file'
        };
        let response = {
            send: () => { }
        };

        sinon.spy(file, 'constructor');
        sinon.stub(File.prototype, 'copy').returns(Promise.resolve());

        return copyItem(request, response)
        .then(() => {
            expect(file.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'file (1)'), fileStructure);
            expect(File.prototype.copy).to.have.been.calledWith(file);
        })
        .finally(() => {
            File.prototype.copy.restore();
        });
    });

    it('should copy a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            url: '/fs/directory'
        };
        let response = {
            send: () => { }
        };

        sinon.spy(directory, 'constructor');
        sinon.stub(Directory.prototype, 'copy').returns(Promise.resolve());

        return copyItem(request, response)
        .then(() => {
            expect(directory.constructor).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory (1)'), fileStructure);
            expect(Directory.prototype.copy).to.have.been.calledWith(directory);
        })
        .finally(() => {
            Directory.prototype.copy.restore();
        });
    });

    it(`should throw an error if it can't find the item to copy`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            url: '/fs/directory/missing-item'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(tractorErrorHandler, 'handle');

        copyItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));

        tractorErrorHandler.handle.restore();
    });

    it('should handle known TractorErrors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);
        let request = {
            url: '/fs/directory/file'
        };
        let response = {
            send: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'copy').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        return copyItem(request, response)
        .then(() => {
            expect(File.prototype.copy).to.have.been.calledWith(file);
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            File.prototype.copy.restore();
            tractorErrorHandler.handle.restore();
        });
    });

    it('should handle unknown errors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);
        let request = {
            url: '/fs/directory/file'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'copy').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        return copyItem(request, response)
        .then(() => {
            expect(File.prototype.copy).to.have.been.calledWith(file);
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not copy "${path.join(path.sep, 'file-structure', 'directory', 'file')}"`, CONSTANTS.SERVER_ERROR));
        })
        .finally(() => {
            File.prototype.copy.restore();
            tractorErrorHandler.handle.restore();
        });
    });
});
