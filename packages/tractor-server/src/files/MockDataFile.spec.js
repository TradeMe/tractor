/* global describe:true, it:true */

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
import { TractorError } from 'tractor-error-handler';
import { File, FileStructure } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

// Under test:
import MockDataFile from './MockDataFile';

describe('server/files: MockDataFile:', () => {
    describe('MockDataFile constructor:', () => {
        it('should create a new MockDataFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new MockDataFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(MockDataFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new MockDataFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('MockDataFile.delete:', () => {
        it('should delete the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new MockDataFile(filePath, fileStructure);

            return file.delete()
            .then(() => {
                expect(File.prototype.delete).to.have.been.called();
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });

        it('should delete the list of references to the file', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            fileStructure.references[filePath] = [];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new MockDataFile(filePath, fileStructure);

            return file.delete()
            .then(() => {
                expect(fileStructure.references[filePath]).to.be.undefined();
            })
            .finally(() => {
                File.prototype.delete.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should throw an error if the mock data is referenced by other files', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            fileStructure.references[filePath] = ['fake reference'];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new MockDataFile(filePath, fileStructure);

            return file.delete()
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Cannot delete ${file.path} as it is referenced by another file.`));
            })
            .finally(() => {
                File.prototype.delete.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should not throw an error if `isMove` is true', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            fileStructure.references[filePath] = [];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
            sinon.spy(Promise, 'reject');

            let file = new MockDataFile(filePath, fileStructure);

            return file.delete({ isMove: true })
            .then(() => {
                expect(Promise.reject).to.not.have.been.called();
            })
            .finally(() => {
                File.prototype.delete.restore();
                Promise.reject.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });
    });

    describe('MockDataFile.save:', () => {
        it('should save the file to disk', () => {
            let content = '';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new MockDataFile(filePath, fileStructure);

            return file.save(content)
            .then(() => {
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });
    });

    describe('MockDataFile.delete:', () => {
        it('should delete the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new MockDataFile(filePath, fileStructure);

            return file.delete()
            .then(() => {
                expect(File.prototype.delete).to.have.been.called();
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });
    });

    describe('MockDataFile.move:', () => {
        it('should move the file', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockDataFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockDataFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.resolve());

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(File.prototype.move).to.have.been.calledWith(update, options);
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                Promise.map.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should update the class name of the mock data in files that reference it', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockDataFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockDataFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.mock.json');
            let referenceFile = new MockDataFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformIdentifiers).to.have.been.calledWith(referenceFile, 'File', 'NewFile', 'VariableDeclarator');
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should update the instance name of the mock data in files that reference it', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockDataFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockDataFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.mock.json');
            let referenceFile = new MockDataFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformIdentifiers).to.have.been.calledWith(referenceFile, 'file', 'newFile', 'VariableDeclarator');
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should update the metadata of the mock data in files that reference it', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockDataFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockDataFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.mock.json');
            let referenceFile = new MockDataFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformMetadata).to.have.been.calledWith(referenceFile, 'file', 'new file', 'mockData');
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should update the require path to the mock data in files that reference it', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockDataFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockDataFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.mock.json');
            let referenceFile = new MockDataFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformRequirePaths).to.have.been.calledWith(referenceFile, {
                    fromPath: referenceFilePath,
                    oldToPath: filePath,
                    newToPath: newFilePath
                });
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });

        it('should throw if updating references fails', () => {
            let oldFileStructure = tractorFileStructure.fileStructure;

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');
            let file = new MockDataFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.mock.json');
            let newFile = new MockDataFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.reject());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');

            let update = {};
            let options = {};

            return file.move(update, options)
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Could not update references after moving ${filePath}.`));
            })
            .finally(() => {
                File.prototype.move.restore();
                File.prototype.save.restore();
                Promise.map.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                tractorFileStructure.fileStructure = oldFileStructure;
            });
        });
    });

    describe('MockDataFile.serialise:', () => {
        it(`should include the file's content`, () => {
            let content = 'content';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');

            sinon.stub(File.prototype, 'serialise').returns({});

            let file = new MockDataFile(filePath, fileStructure);
            file.content = content;

            file.serialise();

            expect(file.content).to.equal(content);

            File.prototype.serialise.restore();
        });
    });
});
