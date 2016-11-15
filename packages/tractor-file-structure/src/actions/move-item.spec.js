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
import { moveItem } from './move-item';

describe('tractor-file-structure - actions/move-item:', () => {
    it('should move a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            },
            url: `/fs${file.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'move').returns(Promise.resolve());

        return moveItem(request, response)
        .then(() => {
            expect(File.prototype.move).to.have.been.calledWith({
                newPath: path.join(path.sep, 'file-structure', 'other-directory', 'file.ext')
            });
        })
        .finally(() => {
            File.prototype.move.restore();
        });
    });

    it('should copy a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                copy: true
            },
            url: `/fs${file.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'move').returns(Promise.resolve());

        return moveItem(request, response)
        .then(() => {
            expect(File.prototype.move).to.have.been.calledWith({
                newPath: path.join(path.sep, 'file-structure', 'directory', 'file (1).ext')
            });
        })
        .finally(() => {
            File.prototype.move.restore();
        });
    });

    it('should move a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            body: {
                newPath: path.join(path.sep, 'file-structure', 'other-directory')
            },
            url: `/fs${directory.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'move').returns(Promise.resolve());

        return moveItem(request, response)
        .then(() => {
            expect(Directory.prototype.move).to.have.been.calledWith({
                newPath: path.join(path.sep, 'file-structure', 'other-directory')
            });
        })
        .finally(() => {
            Directory.prototype.move.restore();
        });
    });

    it('should copy a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);

        let request = {
            body: {
                copy: true
            },
            url: `/fs${directory.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'move').returns(Promise.resolve());

        return moveItem(request, response)
        .then(() => {
            expect(Directory.prototype.move).to.have.been.calledWith({
                newPath: path.join(path.sep, 'file-structure', 'directory (1)')
            });
        })
        .finally(() => {
            Directory.prototype.move.restore();
        });
    });

    it(`should respond with the updated fileStructure`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            url: `/fs${file.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'move').returns(Promise.resolve());
        sinon.stub(response, 'send');

        return moveItem(request, response)
        .then(() => {
            expect(response.send).to.have.been.calledWith(fileStructure.structure);
        })
        .finally(() => {
            File.prototype.move.restore();
        });
    });

    it(`should throw an error if it can't find the item to move`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: { },
            url: '/fs/directory/missing-item'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(tractorErrorHandler, 'handle');

        moveItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));

        tractorErrorHandler.handle.restore();
    });

    it('should handle known TractorErrors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            url: `/fs${file.url}`
        };
        let response = {
            send: () => { }
        };
        let error = new TractorError();

        sinon.stub(File.prototype, 'move').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        return moveItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            File.prototype.move.restore();
            tractorErrorHandler.handle.restore();
        });
    });

    it('should handle unknown errors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new File(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: { },
            url: `/fs${file.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'move').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        return moveItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not move "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`, CONSTANTS.SERVER_ERROR));
        })
        .finally(() => {
            File.prototype.move.restore();
            tractorErrorHandler.handle.restore();
        });
    });
});
