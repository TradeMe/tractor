/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '../../tests/setup';

// Dependencies:
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('graceful-fs'));
import * as tractorLogger from 'tractor-logger';

// Under test:
import init from './init';

describe('tractor-plugin-page-objects: init:', () => {
    it('should create the page-objects directory', () => {
        let config = {
            directory: './tractor'
        };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(process, 'cwd').returns('/');

        return init(config)
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith('/tractor/page-objects');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            process.cwd.restore();
        });
    });

    it('should throw if something goes wrong', () => {
        let config = {
            directory: './tractor'
        };
        let error = new Promise.OperationalError();
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(process, 'cwd').returns('/');

        return init(config)
        .catch(e => {
            expect(e).to.equal(error);
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            process.cwd.restore();
        });
    });

    it('should just move on if the directory already exists', () => {
        let config = {
            directory: './tractor'
        };
        let error = new Promise.OperationalError();
        error.cause = { code: 'EEXIST' };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(process, 'cwd').returns('/');
        sinon.stub(tractorLogger, 'warn');

        return init(config)
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"/tractor/page-objects" directory already exists. Moving on...');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            process.cwd.restore();

        });
    });
});
