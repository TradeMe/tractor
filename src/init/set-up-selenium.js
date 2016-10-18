// Utilities:
import path from 'path';
import Promise from 'bluebird';
const childProcess = Promise.promisifyAll(require('child_process'));

// Constants:
const SELENIUM_UPDATE_COMMAND = `node ${path.join('node_modules', 'protractor', 'bin', 'webdriver-manager')} update`;

export default {
    run: setUpSelenium
};

function setUpSelenium () {
    console.info('Setting up Selenium...');
    return childProcess.execAsync(SELENIUM_UPDATE_COMMAND)
    .then(() => console.log('Selenium setup complete.'));
}
