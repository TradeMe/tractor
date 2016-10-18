/* global describe:true, it:true */

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
import path from 'path';

// Under test:
import setUpSelenium from './set-up-selenium';

describe('tractor - init/set-up-selenium:', () => {
    it('should run the "webdriver-manager update" command', () => {
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(console, 'info');
        sinon.stub(console, 'log');

        return setUpSelenium.run()
        .then(() => {
            let webdriverManagerPath = path.join('node_modules', 'protractor', 'bin', 'webdriver-manager');
            expect(childProcess.execAsync).to.have.been.calledWith(`node ${webdriverManagerPath} update`);
        })
        .finally(() => {
            childProcess.execAsync.restore();
            console.info.restore();
            console.log.restore();
        });
    });

    it('should tell the user what it is doing', () => {
        sinon.stub(childProcess, 'execAsync').returns(Promise.resolve());
        sinon.stub(console, 'info');
        sinon.stub(console, 'log');

        return setUpSelenium.run()
        .then(() => {
            expect(console.info).to.have.been.calledWith('Setting up Selenium...');
            expect(console.log).to.have.been.calledWith('Selenium setup complete.');
        })
        .finally(() => {
            childProcess.execAsync.restore();
            console.info.restore();
            console.log.restore();
        });
    });
});
