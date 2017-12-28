/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '../../test-setup';

// Dependencies:
import childProcess from 'child_process';
import path from 'path';
import * as tractorLogger from 'tractor-logger';

// Under test:
import { setUpSelenium } from './set-up-selenium';

describe('tractor - set-up-selenium:', () => {
    it('should run the "webdriver-manager update" command', () => {
        sinon.stub(childProcess, 'execAsync').resolves();
        sinon.stub(tractorLogger, 'info');

        return setUpSelenium()
        .then(() => {
            let webdriverManagerPath = path.join('node_modules', 'protractor', 'bin', 'webdriver-manager');
            expect(childProcess.execAsync).to.have.been.calledWith(`node ${webdriverManagerPath} update`);
        })
        .finally(() => {
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(childProcess, 'execAsync').resolves();
        sinon.stub(tractorLogger, 'info');

        return setUpSelenium()
        .then(() => {
            expect(tractorLogger.info).to.have.been.calledWith('Setting up Selenium...');
            expect(tractorLogger.info).to.have.been.calledWith('Selenium setup complete.');
        })
        .finally(() => {
            childProcess.execAsync.restore();
            tractorLogger.info.restore();
        });
    });

    it('should tell the user if webdriver cannot be updated', () => {
        sinon.stub(childProcess, 'execAsync').rejects();
        sinon.stub(tractorLogger, 'error');
        sinon.stub(tractorLogger, 'info');

        return setUpSelenium()
        .then(() => {
            expect(tractorLogger.error).to.have.been.calledWith(`Couldn't update Selenium. Either run "tractor init" again, or install it manually by running "webdriver-manager update"`);
        })
        .finally(() => {
            childProcess.execAsync.restore();
            tractorLogger.error.restore();
            tractorLogger.info.restore();
        });
    });
});
