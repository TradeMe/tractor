/* global describe:true, it:true, xit:true */

// Utilities:
import Promise from 'bluebird';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import { Directory } from '../structure/Directory';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';
import * as utilities from '../utilities/utilities';
import { TractorError } from 'tractor-error-handler';
import * as tractorErrorHandler from 'tractor-error-handler';

// Under test:
import { createDeleteItemHandler } from './delete-item';

describe('tractor-file-structure - actions/delete-item:', () => {
    it('should delete a file', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
        })
        .finally(() => {
            File.prototype.delete.restore();
        });
    });

    it('should delete a directory', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            params: [directory.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'delete').returns(Promise.resolve());

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(Directory.prototype.delete).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.delete.restore();
        });
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

    it('should rimraf a directory', () => {
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

        sinon.stub(Directory.prototype, 'rimraf').returns(Promise.resolve());

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(Directory.prototype.rimraf).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.rimraf.restore();
        });
    });

    it(`should respond with OK`, () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);

        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
        sinon.stub(response, 'sendStatus');

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(response.sendStatus).to.have.been.calledWith(200);
        })
        .finally(() => {
            File.prototype.delete.restore();
        });
    });

    it('should fall back to delete if `rimraf` is passed but the item is not a directory', () => {
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

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
        })
        .finally(() => {
            File.prototype.delete.restore();
        });
    });

    it('should cleanup a file', () => {
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

        sinon.stub(File.prototype, 'cleanup').returns(Promise.resolve());

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.cleanup).to.have.been.called();
        })
        .finally(() => {
            File.prototype.cleanup.restore();
        });
    });

    it('should cleanup a directory', () => {
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

        sinon.stub(Directory.prototype, 'cleanup').returns(Promise.resolve());

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(Directory.prototype.cleanup).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.cleanup.restore();
        });
    });

    xit('should handle known TractorErrors', () => {
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

        sinon.stub(File.prototype, 'delete').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handleError');

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
            expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            File.prototype.delete.restore();
            tractorErrorHandler.handleError.restore();
        });
    });

    xit('should handle unknown errors', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            params: [file.url],
            query: { }
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handleError');

        let deleteItem = createDeleteItemHandler(fileStructure);
        return deleteItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handleError).to.have.been.calledWith(response, new TractorError(`Could not delete "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));
        })
        .finally(() => {
            File.prototype.delete.restore();
            tractorErrorHandler.handleError.restore();
        });
    });
});
