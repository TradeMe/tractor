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
import { File, FileStructure } from 'tractor-file-structure';

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

        it('should delete the file from the references data structure:', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
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
            });
        });
    });
});
