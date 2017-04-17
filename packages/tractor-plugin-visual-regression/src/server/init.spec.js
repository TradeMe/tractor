/* global describe:true, it:true */

// Utilities:
import Promise from 'bluebird';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
const fs = Promise.promisifyAll(require('fs'));

// Under test:
import init from './init';

describe('tractor-plugin-visual-regression - init:', () => {
    it('should create the visual regression file structure', () => {
        let config = {
            directory: 'file-structure'
        };

        sinon.stub(process, 'cwd').returns(path.sep);
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());

        return init(config)
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression');
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression/baseline');
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression/changes');
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression/diffs');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            process.cwd.restore();
        });
    });

    it('should handle the error when a directory already exists', () => {
        let config = {
            directory: 'file-structure'
        };
        let error = {
            code: 'EEXIST'
        };

        sinon.stub(process, 'cwd').returns(path.sep);
        let stub = sinon.stub(fs, 'mkdirAsync');
        stub.onCall(0).returns(Promise.reject(error));
        stub.returns(Promise.resolve());

        return init(config)
        .then(() => {
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression/baseline');
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression/changes');
            expect(fs.mkdirAsync).to.have.been.calledWith('/file-structure/visual-regression/diffs');
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            process.cwd.restore();
        });
    });

    it('should throw any other errors', () => {
        let config = {
            directory: 'file-structure'
        };
        let error = {};

        sinon.stub(process, 'cwd').returns(path.sep);
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));

        return init(config)
        .catch(e => {
            expect(e).to.equal(error);
        })
        .finally(() => {
            fs.mkdirAsync.restore();
            process.cwd.restore();
        });
    });
});
