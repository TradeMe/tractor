// Utilities:
import path from 'path';
import Promise from 'bluebird';
const childProcess = Promise.promisifyAll(require('child_process'));
import { error, info } from 'tractor-logger';

// Constants:
const SELENIUM_UPDATE_COMMAND = `node ${path.join('node_modules', 'protractor', 'bin', 'webdriver-manager')} update`;

export function setUpSelenium () {
    info('Setting up Selenium...');
    return childProcess.execAsync(SELENIUM_UPDATE_COMMAND)
    .then(() => info('Selenium setup complete.'))
    .catch(() => error(`Couldn't update Selenium. Either run "tractor init" again, or install it manually by running "webdriver-manager update"`));
}
