/* global describe:true, it:true */
'use strict';

// Utilities:
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import childProcess from 'child_process';
import log from 'npmlog';
import path from 'path';

// Under test:
import setUpSelenium from './set-up-selenium';

describe('server/cli/init: set-up-selenium:', () => {
    it('should run the "webdriver-manager update" command', () => {
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return setUpSelenium.run()
        .then(() => {
            let webdriverManagerPath = path.join('node_modules', 'protractor', 'bin', 'webdriver-manager');
            expect(childProcess.execAsync).to.have.been.calledWith(`node ${webdriverManagerPath} update`);
        })
        .finally(() => {
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'verbose');

        return setUpSelenium.run()
        .then(() => {
            expect(log.info).to.have.been.calledWith('Setting up Selenium...');
            expect(log.verbose).to.have.been.calledWith('Selenium setup complete.');
        })
        .finally(() => {
            childProcess.execAsync.restore();
            log.info.restore();
            log.verbose.restore();
        });
    });
});
