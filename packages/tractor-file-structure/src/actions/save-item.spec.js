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
import Directory from '../structure/Directory';
import File from '../structure/File';
import FileStructure from '../structure/FileStructure';
import { fileExtensions, fileTypes, registerFileType } from '../file-types';
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { createSaveItemHandler } from './save-item';

describe('tractor-file-structure - actions/save-item:', () => {
    it('should save a file', () => {
        class TestFile extends File {
            save () { }
        }
        TestFile.prototype.extension = '.ext';
        TestFile.prototype.type = 'test-file';
        registerFileType(TestFile);

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
        sinon.stub(TestFile.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(TestFile.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete fileExtensions['test-file'];
            delete fileTypes['.ext'];

            Directory.prototype.save.restore();
        });
    });

    it('should save a new file with multiple extensions', () => {
        class SpecialTestFile extends File {
            save () { }
        }
        SpecialTestFile.prototype.extension = '.special.ext';
        SpecialTestFile.prototype.type = 'special-test-file';
        registerFileType(SpecialTestFile);

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.special.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(SpecialTestFile.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(SpecialTestFile.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete fileExtensions['special-test-file'];
            delete fileTypes['.special.ext'];
        });
    });

    it('should fall back to the default File', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(File.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            File.prototype.save.restore();
        });
    });

    it('should save a copy of a file if it already exists', () => {
        class TestFile extends File {
            save () { }
        }
        TestFile.prototype.extension = '.ext';
        TestFile.prototype.type = 'test-file';
        registerFileType(TestFile);

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                data: 'data'
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.spy(file, 'save');
        sinon.stub(TestFile.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(file.save).to.not.have.been.called();
            expect(TestFile.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete fileExtensions['test-file'];
            delete fileTypes['.ext'];
        });
    });

    it('should overwrite an existing file', () => {
        class TestFile extends File {
            save () { }
        }
        TestFile.prototype.extension = '.ext';
        TestFile.prototype.type = 'test-file';
        registerFileType(TestFile);

        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new TestFile(path.join(path.sep, 'file-structure', 'directory', 'file.ext'), fileStructure);
        let request = {
            body: {
                data: 'data',
                overwrite: true
            },
            params: [file.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(TestFile.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(TestFile.prototype.save).to.have.been.calledWith('data');
        })
        .finally(() => {
            delete fileExtensions['test-file'];
            delete fileTypes['.ext'];
        });
    });

    it('should save a directory', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: { },
            params: ['/directory']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(Directory.prototype.save).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.save.restore();
        });
    });

    it('should save a copy of a directory if it already exists', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let request = {
            body: { },
            params: [directory.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.spy(directory, 'save');
        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(directory.save).to.not.have.been.called();
            expect(Directory.prototype.save).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.save.restore();
        });
    });

    it('should overwrite an existing directory', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let request = {
            body: {
              overwrite: true
            },
            params: [directory.url]
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(Directory.prototype.save).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.save.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let error = new TractorError();
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'save').returns(Promise.reject(error));
        sinon.stub(tractorErrorHandler, 'handle');

        let saveItem = createSaveItemHandler(fileStructure);
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
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            body: {
                data: 'data'
            },
            params: ['/directory/file.ext']
        };
        let response = {
            sendStatus: () => { }
        };

        sinon.stub(File.prototype, 'save').returns(Promise.reject(new Error()));
        sinon.stub(tractorErrorHandler, 'handle');

        let saveItem = createSaveItemHandler(fileStructure);
        return saveItem(request, response)
        .then(() => {
            expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not save "${path.join(path.sep, 'file-structure', 'directory', 'file.ext')}"`));
        })
        .finally(() => {
            File.prototype.save.restore();
            tractorErrorHandler.handle.restore();
        });
    });
});
