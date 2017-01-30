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
import createTestDirectoryStructure from './create-test-directory-structure';
import createBaseTestFiles from './create-base-test-files';
import installTractorDependenciesLocally from './install-tractor-dependencies-locally';
import setUpSelenium from './set-up-selenium';
import * as tractorLogger from 'tractor-logger';

// Under test:
import cliInit from './index';

describe('tractor - init/index:', () => {
    it('should run the initialisation steps', () => {
        sinon.stub(createTestDirectoryStructure, 'run').returns(Promise.resolve());
        sinon.stub(createBaseTestFiles, 'run').returns(Promise.resolve());
        sinon.stub(installTractorDependenciesLocally, 'run').returns(Promise.resolve());
        sinon.stub(setUpSelenium, 'run').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return cliInit()
        .then(() => {
            expect(createTestDirectoryStructure.run).to.have.been.calledOnce();
            expect(createBaseTestFiles.run).to.have.been.calledOnce();
            expect(installTractorDependenciesLocally.run).to.have.been.calledOnce();
            expect(setUpSelenium.run).to.have.been.calledOnce();
        })
        .finally(() => {
            createTestDirectoryStructure.run.restore();
            createBaseTestFiles.run.restore();
            installTractorDependenciesLocally.run.restore();
            setUpSelenium.run.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(createTestDirectoryStructure, 'run').returns(Promise.resolve());
        sinon.stub(createBaseTestFiles, 'run').returns(Promise.resolve());
        sinon.stub(installTractorDependenciesLocally, 'run').returns(Promise.resolve());
        sinon.stub(setUpSelenium, 'run').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return cliInit()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Setting up tractor...');
            expect(tractorLogger.info).to.have.been.calledWith('Set up complete!');
        })
        .finally(() => {
            createTestDirectoryStructure.run.restore();
            createBaseTestFiles.run.restore();
            installTractorDependenciesLocally.run.restore();
            setUpSelenium.run.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if there is an error', () => {
        let message = 'error';
        sinon.stub(createTestDirectoryStructure, 'run').returns(Promise.reject(new Error(message)));
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        return cliInit()
        .catch(() => { })
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith('Something broke, sorry :(');
            expect(tractorLogger.error).to.have.been.calledWith(message);
        })
        .finally(() => {
            createTestDirectoryStructure.run.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
