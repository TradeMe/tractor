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
    it('should create the tests directory structure', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(fs, 'exists').yields(false);
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

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
            fs.exists.restore();
            log.info.restore();
            log.warn.restore();
        });
    });

    it('should tell the user if the directory already exists', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(fs, 'exists').yields(true);
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(log.warn).to.have.been.calledWith('"directory" directory already exists.');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            fs.exists.restore();
            log.info.restore();
            log.warn.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(fs, 'exists').yields(false);
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(() => {
            expect(log.info).to.have.been.calledWith('Creating directory structure...');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            fs.exists.restore();
            log.info.restore();
            log.warn.restore();
        });
    });
    it('should rethrow any other errors', () => {
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'exists').yields(false);
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .catch(() => { })
        .then(() => {
            expect(log.warn).to.not.have.been.called();
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            fs.exists.restore();
            log.info.restore();
            log.warn.restore();
        });
    });
});
