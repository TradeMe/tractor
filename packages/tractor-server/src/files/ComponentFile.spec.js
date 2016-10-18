/* global describe:true, it:true */

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
import JavaScriptFile from './JavaScriptFile';
import { File, FileStructure } from 'tractor-file-structure';

// Under test:
import ComponentFile from './ComponentFile';

describe('server/files: ComponentFile:', () => {
    describe('ComponentFile constructor:', () => {
        it('should create a new ComponentFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new ComponentFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(ComponentFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new ComponentFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });
    });

    describe('ComponentFile.delete:', () => {
        it('should delete the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, fileStructure);

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
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            fileStructure.references[filePath] = [];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, fileStructure);

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
