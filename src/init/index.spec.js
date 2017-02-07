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
import * as createTestDirectoryStructure from './create-test-directory-structure';
import * as createBaseTestFiles from './create-base-test-files';
import * as initialisePlugins from './initialise-plugins';
import * as installTractorDependenciesLocally from './install-tractor-dependencies-locally';
import * as setUpSelenium from './set-up-selenium';
import * as tractorLogger from 'tractor-logger';

// Under test:
import cliInit from './index';

describe('tractor - init/index:', () => {
    it('should run the initialisation steps', () => {
        sinon.stub(createTestDirectoryStructure, 'createTestDirectoryStructure').returns(Promise.resolve());
        sinon.stub(createBaseTestFiles, 'createBaseTestFiles').returns(Promise.resolve());
        sinon.stub(initialisePlugins, 'initialisePlugins').returns(Promise.resolve());
        sinon.stub(installTractorDependenciesLocally, 'installTractorDependenciesLocally').returns(Promise.resolve());
        sinon.stub(setUpSelenium, 'setUpSelenium').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return cliInit()
        .then(() => {
            expect(createTestDirectoryStructure.createTestDirectoryStructure).to.have.been.calledOnce();
            expect(createBaseTestFiles.createBaseTestFiles).to.have.been.calledOnce();
            expect(installTractorDependenciesLocally.installTractorDependenciesLocally).to.have.been.calledOnce();
            expect(setUpSelenium.setUpSelenium).to.have.been.calledOnce();
        })
        .finally(() => {
            createTestDirectoryStructure.createTestDirectoryStructure.restore();
            createBaseTestFiles.createBaseTestFiles.restore();
            initialisePlugins.initialisePlugins.restore();
            installTractorDependenciesLocally.installTractorDependenciesLocally.restore();
            setUpSelenium.setUpSelenium.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(createTestDirectoryStructure, 'createTestDirectoryStructure').returns(Promise.resolve());
        sinon.stub(createBaseTestFiles, 'createBaseTestFiles').returns(Promise.resolve());
        sinon.stub(initialisePlugins, 'initialisePlugins').returns(Promise.resolve());
        sinon.stub(installTractorDependenciesLocally, 'installTractorDependenciesLocally').returns(Promise.resolve());
        sinon.stub(setUpSelenium, 'setUpSelenium').returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return cliInit()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Setting up tractor...');
            expect(tractorLogger.info).to.have.been.calledWith('Set up complete!');
        })
        .finally(() => {
            createTestDirectoryStructure.createTestDirectoryStructure.restore();
            createBaseTestFiles.createBaseTestFiles.restore();
            initialisePlugins.initialisePlugins.restore();
            installTractorDependenciesLocally.installTractorDependenciesLocally.restore();
            setUpSelenium.setUpSelenium.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if there is an error', () => {
        let message = 'error';
        sinon.stub(createTestDirectoryStructure, 'createTestDirectoryStructure').returns(Promise.reject(new Error(message)));
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        return cliInit()
        .catch(() => { })
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith('Something broke, sorry 😕');
            expect(tractorLogger.error).to.have.been.calledWith(message);
        })
        .finally(() => {
            createTestDirectoryStructure.createTestDirectoryStructure.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
