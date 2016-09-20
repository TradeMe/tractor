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
import fs from 'graceful-fs';
import path from 'path';

// Under test:
import File from './File';

describe('server/files: File:', () => {
    describe('File constructor:', () => {
        it('should create a new File', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            let file = new File(filePath, directory);

            expect(file).to.be.an.instanceof(File);
        });

        it('should work out the name from the file path', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            let file = new File(filePath, directory);

            expect(file.name).to.equal('name');
        });

        it('should be added to it\'s directory', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            sinon.stub(directory, 'addFile');

            let file = new File(filePath, directory);

            expect(directory.addFile).to.have.been.calledWith(file);
        });
    });

    describe('File.read:', () => {
        it('should read the file', () => {
            let content = 'content';
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(content));

            let file = new File(filePath, directory);

            return file.read()
            .then(() => {
                expect(fs.readFileAsync).to.have.been.calledWith(path.join('some', 'file', 'name.js'));
                expect(file.content).to.equal('content');
            })
            .finally(() => {
                fs.readFileAsync.restore();
            });
        });
    });

    describe('File.save:', () => {
        it('should save the file', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());

            let file = new File(filePath, directory);
            file.content = 'content';

            return file.save()
            .then(() => {
                expect(fs.writeFileAsync).to.have.been.calledWith(path.join('some', 'file', 'name.js'), 'content');
            })
            .finally(() => {
                fs.writeFileAsync.restore();
            });
        });

        it('should add the file to it\'s directory', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            sinon.stub(directory, 'addFile');
            sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());

            let file = new File(filePath, directory);

            return file.save()
            .then(() => {
                expect(directory.addFile).to.have.been.calledTwice();
            })
            .finally(() => {
                fs.writeFileAsync.restore();
            });
        });
    });

    describe('File.delete:', () => {
        it('should delete the file', () => {
            let directory = {
                addFile: _.noop,
                removeFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            sinon.stub(fs, 'unlinkAsync').returns(Promise.resolve());

            let file = new File(filePath, directory);

            return file.delete()
            .then(() => {
                expect(fs.unlinkAsync).to.have.been.calledWith(path.join('some', 'file', 'name.js'));
            })
            .finally(() => {
                fs.unlinkAsync.restore();
            });
        });

        it('should remove the file from it\'s directory', () => {
            let directory = {
                addFile: _.noop,
                removeFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            sinon.stub(directory, 'removeFile');
            sinon.stub(fs, 'unlinkAsync').returns(Promise.resolve());

            let file = new File(filePath, directory);

            return file.delete()
            .then(() => {
                expect(directory.removeFile).to.have.been.calledOnce();
            })
            .finally(() => {
                fs.unlinkAsync.restore();
            });
        });
    });

    describe('File.toJSON:', () => {
        it('should return specific properties of the object', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'file', 'name.js');

            let file = new File(filePath, directory);
            file.ast = 'ast';
            file.content = 'content';
            file.tokens = 'tokens';

            let json = file.toJSON();

            expect(json).to.deep.equal({
                ast: 'ast',
                content: 'content',
                path: path.join('some', 'file', 'name.js'),
                name: 'name',
                tokens: 'tokens'
            });
        });
    });
});
