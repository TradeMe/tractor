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

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
        })
        .finally(() => {
            File.prototype.delete.restore();
        });
    });

    it('should delete a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: { }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'delete').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(Directory.prototype.delete).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.delete.restore();
        });
    });

    it(`should throw an error if it can't find the item to delete`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            params: ['/directory/missing-item'],
            query: { }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(tractorErrorHandler, 'handle');

        deleteItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));

        tractorErrorHandler.handle.restore();
    });

    it('should rimraf a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: {
                rimraf: true
            }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'rimraf').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(Directory.prototype.rimraf).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.rimraf.restore();
        });
    });

    it(`should respond with the updated fileStructure`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
        sinon.stub(response, 'send');

        return deleteItem(request, response)
        .then(() => {
            expect(response.send).to.have.been.calledWith(fileStructure.structure);
        })
        .finally(() => {
            File.prototype.delete.restore();
        });
    });

    it('should fall back to delete if `rimraf` is passed but the item is not a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: {
                rimraf: true
            }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
        })
        .finally(() => {
            File.prototype.delete.restore();
        });
    });

    it('should cleanup a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: {
                cleanup: true
            }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'cleanup').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.cleanup).to.have.been.called();
        })
        .finally(() => {
            File.prototype.cleanup.restore();
        });
    });

    it('should cleanup a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: {
                cleanup: true
            }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'cleanup').returns(Promise.resolve());

        return deleteItem(request, response)
        .then(() => {
            expect(Directory.prototype.cleanup).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.cleanup.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            send: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'delete').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            File.prototype.delete.restore();
            tractorErrorHandler.handle.restore();
        });
    });

    it('should handle unknown errors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        return deleteItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not delete "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`, CONSTANTS.SERVER_ERROR));
        })
        .finally(() => {
            File.prototype.delete.restore();
            tractorErrorHandler.handle.restore();
        });
    });
});
