/* global describe:true, it:true */

// Test setup:
import { expect, Promise, sinon } from '../../../../test-setup';

// Dependencies:
import path from 'path';
import { TractorError } from 'tractor-error-handler';
import { File, FileStructure } from 'tractor-file-structure';

// Under test:
import { MockRequestFile } from './mock-request-file';

describe('tractor-plugin-mock-requests - mock-request-file:', () => {
    describe('MockRequestFile constructor:', () => {
        it('should create a new MockRequestFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new MockRequestFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(MockRequestFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new MockRequestFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('MockRequestFile.move:', () => {
        it('should move the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockRequestFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockRequestFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(MockRequestFile.prototype, 'refactor').returns(Promise.resolve());

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(File.prototype.move).to.have.been.calledWith(update, options);
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                MockRequestFile.prototype.refactor.restore();
            });
        });

        it('should update the name of the mock request in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockRequestFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockRequestFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file');
            let referenceFile = new File(referenceFilePath, fileStructure);

            sinon.stub(fileStructure.referenceManager, 'getReferencedBy').returns([referenceFile]);
            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'refactor').returns(Promise.resolve(newFile));

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(referenceFile.refactor).to.have.been.calledWith('mockRequestFileNameChange', {
                    oldName: 'file',
                    newName: 'new file'
                });
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.refactor.restore();
            });
        });

        it('should update the require path to the mock data in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockRequestFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockRequestFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file');
            let referenceFile = new File(referenceFilePath, fileStructure);

            sinon.stub(fileStructure.referenceManager, 'getReferencedBy').returns([referenceFile]);
            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'refactor').returns(Promise.resolve(newFile));

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(referenceFile.refactor).to.have.been.calledWith('referencePathChange', {
                    fromPath: referenceFilePath,
                    oldToPath: filePath,
                    newToPath: newFilePath
                });
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.refactor.restore();
            });
        });

        it('should throw if updating references fails', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockRequestFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockRequestFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'refactor').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.reject());

            let update = {
                newPath: newFile.path
            };
            let options = {};

            return file.move(update, options)
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Could not update references after moving ${filePath}.`));
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.refactor.restore();
                Promise.map.restore();
            });
        });
    });

    describe('MockRequestFile.serialise:', () => {
        it(`should include the file's content`, () => {
            let content = 'content';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');

            sinon.stub(File.prototype, 'serialise').returns({});

            let file = new MockRequestFile(filePath, fileStructure);
            file.content = content;

            file.serialise();

            expect(file.content).to.equal(content);

            File.prototype.serialise.restore();
        });
    });
});
