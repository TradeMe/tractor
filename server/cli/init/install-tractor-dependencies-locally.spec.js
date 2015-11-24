/* global describe:true, it:true */
'use strict';

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
import log from 'npmlog';

// Under test:
import installTractorDependenciesLocally from './install-tractor-dependencies-locally';

describe('server/cli/init: install-tractor-dependencies-locally:', () => {
    it('should get the list of currently installed npm dependencies', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return installTractorDependenciesLocally.run()
        .then(() => {
            expect(childProcess.exec).to.have.been.calledWith('npm ls --depth 0');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should install all of the required dependencies', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return installTractorDependenciesLocally.run()
        .then(() => {
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact bluebird@2.10.2');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai@2.3.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai-as-promised@5.1.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber@0.7.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact httpbackend@1.2.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor@2.5.1');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should skip the dependencies that have already been installed', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('bluebird@2.10.2');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return installTractorDependenciesLocally.run()
        .then(() => {
            expect(childProcess.execAsync).not.to.have.been.calledWith('npm install --save-dev --save-exact bluebird@2.10.2');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai@2.3.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai-as-promised@5.1.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber@0.7.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact httpbackend@1.2.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor@2.5.1');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
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
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return installTractorDependenciesLocally.run()
        .then(() => {
            expect(log.info).to.have.been.calledWith('Checking installed npm dependencies...');
            expect(log.info).to.have.been.calledWith('Installing npm dependencies for tractor...');
            expect(log.info).to.have.been.calledWith('Installing "bluebird@2.10.2"...');
            expect(log.verbose).to.have.been.calledWith('Installed "bluebird@2.10.2".');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should tell the user if all dependencies are already installed', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('bluebird@2.10.2 chai@2.3.0 chai-as-promised@5.1.0 cucumber@0.7.0 httpbackend@1.2.1 protractor@2.5.1');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return installTractorDependenciesLocally.run()
        .then(() => {
            expect(log.info).to.have.been.calledWith('All npm dependencies for tractor already installed.');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
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
        let exec = sinon.stub(childProcess, 'execAsync');
        exec.returns(Promise.reject(new Error()));
        sinon.stub(log, 'error');
        sinon.stub(log, 'info');

        return installTractorDependenciesLocally.run()
        .then(() => {
            expect(log.error).to.have.been.calledWith('Couldn\'t install "bluebird@2.10.2". Either run "tractor init" again, or install it manually by running "npm install bluebird@2.10.2"');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            log.error.restore();
            log.info.restore();
        });
    });
});
