/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import fs from 'fs';
import path from 'path';

// Under test:
import createTestDirectoryStructure from './create-test-directory-structure';

describe('cli/init: create-test-directory-structure:', () => {
    it('should create the tests directory structure', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(console, 'info');
        sinon.stub(console, 'log');
        sinon.stub(console, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith('directory');
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'components'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'features'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'step-definitions'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'mock-data'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'support'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'report'));
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            console.info.restore();
            console.log.restore();
            console.warn.restore();
        });
    });

    it('should tell the user if the directory already exists', () => {
        let error = new Promise.OperationalError();
        error.cause = {
            code: 'EEXIST'
        };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(console, 'info');
        sinon.stub(console, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(console.warn).to.have.been.calledWith('"directory" directory already exists. Moving on...');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            console.info.restore();
            console.warn.restore();
        });
    });

    it('should rethrow any other errors', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(console, 'info');
        sinon.stub(console, 'warn');

        return createTestDirectoryStructure.run('directory')
        .catch(() => { })
        .then(() => {
            expect(console.warn).to.not.have.been.called();
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            console.info.restore();
            console.warn.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(console, 'info');
        sinon.stub(console, 'log');
        sinon.stub(console, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(console.info).to.have.been.calledWith('Creating directory structure...');
            expect(console.log).to.have.been.calledWith('Directory structure created.');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            console.info.restore();
            console.log.restore();
            console.warn.restore();
        });
    });
});
