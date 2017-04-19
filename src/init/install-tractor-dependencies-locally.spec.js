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
import { installTractorDependenciesLocally } from './install-tractor-dependencies-locally';

describe('tractor - init/install-tractor-dependencies-locally:', () => {
    it('should get the list of currently installed npm dependencies', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'info');

        return installTractorDependenciesLocally()
        .then(() => {
            expect(childProcess.exec).to.have.been.calledWith('npm ls --depth 0');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
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
        sinon.stub(tractorLogger, 'info');

        return installTractorDependenciesLocally()
        .then(() => {
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact bluebird@2.10.2');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai@2.3.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai-as-promised@5.1.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber@1.3.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber-html-reporter@0.3.5');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor@4.0.11');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor-cucumber-framework@0.6.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-config-loader@0.3.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-dependency-injection@0.1.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-plugin-browser@0.1.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-plugin-loader@0.4.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-plugin-mock-requests@0.2.0-beta.2');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
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
        sinon.stub(tractorLogger, 'info');

        return installTractorDependenciesLocally()
        .then(() => {
            expect(childProcess.execAsync).not.to.have.been.calledWith('npm install --save-dev --save-exact bluebird@2.10.2');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai@2.3.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact chai-as-promised@5.1.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber@1.3.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact cucumber-html-reporter@0.3.5');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor@4.0.11');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact protractor-cucumber-framework@0.6.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-config-loader@0.3.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-dependency-injection@0.1.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-plugin-browser@0.1.1');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-plugin-loader@0.4.0');
            expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev --save-exact tractor-plugin-mock-requests@0.2.0-beta.2');
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

        return installTractorDependenciesLocally()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Checking installed npm dependencies...');
            expect(tractorLogger.info).to.have.been.calledWith('Installing npm dependencies for tractor...');
            expect(tractorLogger.info).to.have.been.calledWith('Installing "bluebird@2.10.2"...');
            expect(tractorLogger.info).to.have.been.calledWith('Installed "bluebird@2.10.2".');
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if all dependencies are already installed', () => {
        sinon.stub(childProcess, 'exec').returns({
            stdout: {
                on: (event, callback) => {
                    callback('bluebird@2.10.2 chai@2.3.0 chai-as-promised@5.1.0 cucumber@1.3.1 cucumber-html-reporter@0.3.5 protractor@4.0.11 protractor-cucumber-framework@0.6.0 tractor-config-loader@0.3.1 tractor-dependency-injection@0.1.1 tractor-plugin-browser@0.1.1 tractor-plugin-loader@0.4.0 tractor-plugin-mock-requests@0.2.0-beta.2');
                }
            }
        });
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(''));
        sinon.stub(tractorLogger, 'info');

        return installTractorDependenciesLocally()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('All npm dependencies for tractor already installed.');
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

        return installTractorDependenciesLocally()
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith(`Couldn't install "bluebird@2.10.2". Either run "tractor init" again, or install it manually by running "npm install bluebird@2.10.2"`);
        })
        .finally(() => {
            childProcess.exec.restore();
            childProcess.execAsync.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
