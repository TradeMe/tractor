/* global describe:true, it:true */

// Utilities:
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
import childProcess from 'child_process';
import * as tractorLogger from 'tractor-logger';

// Under test:
import { installTractorLocally } from './install-tractor-locally';

describe('tractor - init/install-tractor-locally:', () => {
    it('should install tractor', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'info');

        return installTractorLocally()
        .then(() => {
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev tractor@latest');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'info');

        return installTractorLocally()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Installing "tractor@latest"...');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if a dependency cannot be installed', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.reject(new Error()));
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        return installTractorLocally()
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith(`Couldn't install "tractor@latest". Either run "tractor init" again, or install it manually by running "npm install tractor@latest --save-dev"`);
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
