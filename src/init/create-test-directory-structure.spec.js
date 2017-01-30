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
import fs from 'graceful-fs';
import path from 'path';
import * as tractorLogger from 'tractor-logger';

// Under test:
import createTestDirectoryStructure from './create-test-directory-structure';

describe('tractor - init/create-test-directory-structure:', () => {
    it('should create the tests directory structure', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

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
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should tell the user if the directory already exists', () => {
        let error = new Promise.OperationalError();
        error.cause = {
            code: 'EEXIST'
        };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"directory" directory already exists. Moving on...');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should rethrow any other errors', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTestDirectoryStructure.run('directory')
        .catch(() => { })
        .then(() => {
            expect(tractorLogger.warn).to.not.have.been.called();
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');
        sinon.stub(tractorLogger, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Creating directory structure...');
            expect(tractorLogger.info).to.have.been.calledWith('Directory structure created.');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            tractorLogger.info.restore();
            tractorLogger.warn.restore();
        });
    });
});
