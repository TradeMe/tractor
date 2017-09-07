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
import { createTractorDirectoryStructure } from './create-tractor-directory-structure';
import { createBaseTractorFiles } from './create-base-tractor-files';
import { initialisePlugins } from './initialise-plugins';
import { installTractorLocally } from './install-tractor-locally';
import { setUpSelenium } from './set-up-selenium';
import { container } from 'tractor-dependency-injection';
import * as tractorLogger from 'tractor-logger';

// Under test:
import { init } from './index';

describe('tractor - init/index:', () => {
    it('should run the initialisation steps', () => {
        let di = container();

        let diCall = sinon.stub(di, 'call');
        diCall.withArgs(createTractorDirectoryStructure).returns(Promise.resolve());
        diCall.withArgs(createBaseTractorFiles).returns(Promise.resolve());
        diCall.withArgs(initialisePlugins).returns(Promise.resolve());
        diCall.withArgs(installTractorLocally).returns(Promise.resolve());
        diCall.withArgs(setUpSelenium).returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return init(di)
        .then(() => {
            expect(di.call).to.have.been.calledWith(createTractorDirectoryStructure);
            expect(di.call).to.have.been.calledWith(createBaseTractorFiles);
            expect(di.call).to.have.been.calledWith(initialisePlugins);
            expect(di.call).to.have.been.calledWith(installTractorLocally);
            expect(di.call).to.have.been.calledWith(setUpSelenium);
        })
        .finally(() => {
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        let di = container();

        let diCall = sinon.stub(di, 'call');
        diCall.withArgs(createTractorDirectoryStructure).returns(Promise.resolve());
        diCall.withArgs(createBaseTractorFiles).returns(Promise.resolve());
        diCall.withArgs(initialisePlugins).returns(Promise.resolve());
        diCall.withArgs(installTractorLocally).returns(Promise.resolve());
        diCall.withArgs(setUpSelenium).returns(Promise.resolve());
        sinon.stub(tractorLogger, 'info');

        return init(di)
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Setting up tractor...');
            expect(tractorLogger.info).to.have.been.calledWith('Set up complete!');
        })
        .finally(() => {
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if there is an error', () => {
        let di = container();

        let diCall = sinon.stub(di, 'call');
        diCall.withArgs(createTractorDirectoryStructure).returns(Promise.reject(new Error('error')));
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        return init(di)
        .catch(() => { })
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith('Something broke, sorry 😕');
            expect(tractorLogger.error).to.have.been.calledWith('error');
        })
        .finally(() => {
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
