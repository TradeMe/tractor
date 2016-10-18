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
import Directory from '../structure/Directory';
import File from '../structure/File';
import { fileStructure } from '../file-structure';
import { extensions, registerFileType, types } from '../file-types';
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { saveItem } from './save-item';

describe('tractor-file-structure - actions/save-item:', () => {
    it('should save a file', () => {
        class TestFile extends File {
            save () {}
        }
        TestFile.extension = '.extension';
        TestFile.type = 'test-file';
        registerFileType(TestFile);

        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: {
                data: 'data'
            },
            query: { },
            url: 'fs/directory/file.extension'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(TestFile.prototype, 'save').returns(Promise.resolve());

        return saveItem(request, response)
        .then(() => {
            expect(TestFile.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete extensions['test-file'];
            delete types['.extension'];
        });
    });

    it('should save a new file with multiple extensions', () => {
        class SpecialTestFile extends File {
            save () {}
        }
        SpecialTestFile.extension = '.special.extension';
        SpecialTestFile.type = 'special-test-file';
        registerFileType(SpecialTestFile);

        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: {
                data: 'data'
            },
            query: { },
            url: '/fs/directory/file.special.extension'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(SpecialTestFile.prototype, 'save').returns(Promise.resolve());

        return saveItem(request, response)
        .then(() => {
            expect(SpecialTestFile.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete extensions['special-test-file'];
            delete types['.special.extension'];
        });
    });

    it('should fall back to the default File', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: {
                data: 'data'
            },
            query: { },
            url: '/fs/directory/file.extension'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'save').returns(Promise.resolve());

        return saveItem(request, response)
        .then(() => {
            expect(File.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            File.prototype.save.restore();
        });
    });

    it('should overwrite an existing file', () => {
        class TestFile extends File {
            save () {}
        }
        TestFile.extension = '.extension';
        TestFile.type = 'test-file';
        registerFileType(TestFile);

        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.extension'), fileStructure);
        let request = {
            body: {
                data: 'data',
                overwrite: true
            },
            url: '/fs/directory/file.extension'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(file, 'save').returns(Promise.resolve());

        return saveItem(request, response)
        .then(() => {
            expect(file.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete extensions['test-file'];
            delete types['.extension'];
        });
    });

    it('should save a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: { },
            query: { },
            url: '/fs/directory'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());

        return saveItem(request, response)
        .then(() => {
            expect(Directory.prototype.save).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.save.restore();
        });
    });

    it('should overwrite an existing directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let request = {
            body: {
              overwrite: true
            },
            url: '/fs/directory'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(directory, 'save').returns(Promise.resolve());

        return saveItem(request, response)
        .then(() => {
            expect(directory.save).to.have.been.called();
        });
    });

    it('should handle known TractorErrors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let error = new TractorError();
        let request = {
            body: {
                data: 'data'
            },
            query: { },
            url: '/fs/directory/file.extension'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'save').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        return saveItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            File.prototype.save.restore();
            tractorErrorHandler.handle.restore();
        });
    });

    it('should handle unknown errors', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();

        let request = {
            body: {
                data: 'data'
            },
            query: { },
            url: '/fs/directory/file.extension'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'save').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        return saveItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not save "${path.join(path.sep, 'file-structure', 'directory', 'file.extension')}"`, CONSTANTS.SERVER_ERROR));
        })
        .finally(() => {
          File.prototype.save.restore();
          tractorErrorHandler.handle.restore();
        });
    });
});
