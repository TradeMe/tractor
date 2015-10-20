/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import File from './File';

// Under test:
import MockDataFile from './MockDataFile';

describe('server/files: MockDataFile:', () => {
    describe('MockDataFile constructor:', () => {
        it('should create a new MockDataFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new MockDataFile(filePath, directory);

            expect(file).to.be.an.instanceof(MockDataFile);
        });

        it('should inherit from File', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/path';

            let file = new MockDataFile(filePath, directory);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('MockDataFile.save:', () => {
        it('should save the file to disk', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/feature/file.mock.json';

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new MockDataFile(filePath, directory);

            return file.save()
            .then(() => {
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });

        it('should assign the content', () => {
            let data = 'mock data';
            let directory = {
                addFile: _.noop
            };
            let filePath = 'some/feature/file.mock.json';

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new MockDataFile(filePath, directory);

            return file.save(data)
            .then(() => {
                expect(file.content).to.equal('mock data');
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });
    });
});
