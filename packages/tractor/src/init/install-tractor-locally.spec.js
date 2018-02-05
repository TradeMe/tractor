/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from 'tractor-unit-test';

// Dependencies:
import childProcess from 'child_process';
import * as tractorLogger from 'tractor-logger';

// Under test:
import { installTractorLocally } from './install-tractor-locally';

describe('tractor - install-tractor-locally:', () => {
    describe('not installed locally:', () => {
        it('should install tractor when it is not installed locally', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves();
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['2.0.0']));
            exec.withArgs('npm install --save-dev tractor@latest').resolves();
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev tractor@latest');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.info.restore();
            });
        });

        it('should say that it is not installed', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves();
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['2.0.0']));
            exec.withArgs('npm install --save-dev tractor@latest').resolves();
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(tractorLogger.info).to.have.been.calledWith('"tractor" is not installed.');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.info.restore();
            });
        });

        it('should tell the user what it is doing', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves(JSON.stringify({
                dependencies: {
                    tractor: {
                        version: '1.0.0'
                    }
                }
            }));
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['2.0.0']));
            exec.withArgs('npm install --save-dev tractor@latest').resolves();
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(tractorLogger.info).to.have.been.calledWith('Checking local "tractor" version...');
                expect(tractorLogger.info).to.have.been.calledWith('Local version of "tractor" is: 1.0.0');
                expect(tractorLogger.info).to.have.been.calledWith('Installing "tractor"...');
                expect(tractorLogger.info).to.have.been.calledWith('Installed "tractor".');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.info.restore();
            });
        });
    });

    describe('new remote version available', () => {
        it('should install tractor when there is an new remote version available', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves(JSON.stringify({
                dependencies: {
                    tractor: {
                        version: '1.0.0'
                    }
                }
            }));
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['2.0.0']));
            exec.withArgs('npm install --save-dev tractor@latest').resolves();
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(childProcess.execAsync).to.have.been.calledWith('npm install --save-dev tractor@latest');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.info.restore();
            });
        });

        it('should tell the user what it is doing', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves(JSON.stringify({
                dependencies: {
                    tractor: {
                        version: '1.0.0'
                    }
                }
            }));
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['2.0.0']));
            exec.withArgs('npm install --save-dev tractor@latest').resolves();
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(tractorLogger.info).to.have.been.calledWith('Checking remote "tractor" version...');
                expect(tractorLogger.info).to.have.been.calledWith('Latest remote version of "tractor" is: 2.0.0');
                expect(tractorLogger.info).to.have.been.calledWith('Installing "tractor"...');
                expect(tractorLogger.info).to.have.been.calledWith('Installed "tractor".');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.info.restore();
            });
        });

        it('should tell the user if tractor cannot be installed', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves(JSON.stringify({
                dependencies: {
                    tractor: {
                        version: '1.0.0'
                    }
                }
            }));
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['2.0.0']));
            exec.withArgs('npm install --save-dev tractor@latest').rejects();
            sinon.stub(tractorLogger, 'error');
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(tractorLogger.error).to.have.been.calledWith(`Couldn't install "tractor". Either run "tractor init" again, or install it manually by running "npm install tractor@latest --save-dev"`);
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.error.restore();
                tractorLogger.info.restore();
            });
        });
    });

    describe('up to date', () => {
        it('should do nothing if the latest version is already installed', () => {
            let exec = sinon.stub(childProcess, 'execAsync');
            exec.withArgs('npm --json list tractor').resolves(JSON.stringify({
                dependencies: {
                    tractor: {
                        version: '1.0.0'
                    }
                }
            }));
            exec.withArgs('npm --json info tractor versions').resolves(JSON.stringify(['1.0.0']));
            sinon.stub(tractorLogger, 'info');

            return installTractorLocally()
            .then(() => {
                expect(childProcess.execAsync).to.not.have.been.calledWith('npm install --save-dev tractor@latest');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                tractorLogger.info.restore();
            });
        });
    });
});
