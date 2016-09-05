/* global describe:true, it:true */

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import File from './File';
import JavaScriptFile from './JavaScriptFile';

// Under test:
import ComponentFile from './ComponentFile';

describe('server/files: ComponentFile:', () => {
    describe('ComponentFile constructor:', () => {
        it('should create a new ComponentFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new ComponentFile(filePath, directory);

            expect(file).to.be.an.instanceof(ComponentFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new ComponentFile(filePath, directory);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });
    });

    describe('ComponentFile.delete:', () => {
        it('should delete the file from disk', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {}
                }
            };
            let filePath = 'some/component/file.component.js';

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, directory);

            return file.delete()
            .then(() => {
                expect(File.prototype.delete).to.have.been.called();
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });

        it('should delete the file from the references data structure:', () => {
            let directory = {
                addFile: _.noop,
                fileStructure: {
                    references: {
                        'some/component/file.component.js': []
                    }
                }
            };
            let filePath = 'some/component/file.component.js';

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, directory);

            return file.delete()
            .then(() => {
                expect(directory.fileStructure.references['some/mock-data/file.mock.json']).to.be.undefined();
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });
    });
});
