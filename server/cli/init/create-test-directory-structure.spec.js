/* global describe:true, it:true */
'use strict';

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
import log from 'npmlog';
import path from 'path';

// Under test:
import createTestDirectoryStructure from './create-test-directory-structure';

describe('server/cli/init: create-test-directory-structure:', () => {
    it('should create the root test directory', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith('directory');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.verbose.restore();
            log.warn.restore();
        });
    });

    it('should tell the user if the root test directory already exists', () => {
        let error = new Promise.OperationalError();
        error.cause = {
            code: 'EEXIST'
        };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(log.warn).to.have.been.calledWith('"directory" directory already exists. Not creating folder structure...');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
        });
    });

    it('should rethrow any other errors', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .catch(() => { })
        .then(() => {
            expect(log.warn).to.not.have.been.called();
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
        });
    });

    it('should create the subdirectory structure', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'components'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'features'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'step-definitions'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'mock-data'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'support'));
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.verbose.restore();
            log.warn.restore();
        });
    });

    it('should tell the user  what it is doing', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(log.info).to.have.been.calledWith('Creating directory structure...');
            expect(log.verbose).to.have.been.calledWith('Directory structure created.');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.verbose.restore();
            log.warn.restore();
        });
    });
});
