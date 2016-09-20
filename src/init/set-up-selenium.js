// Constants:
import CONSTANTS from '../constants';

// Utilities:
import Promise from 'bluebird';
const childProcess = Promise.promisifyAll(require('child_process'));

export default {
    run: setUpSelenium
};

function setUpSelenium () {
    console.info('Setting up Selenium...');
    return childProcess.execAsync(CONSTANTS.SELENIUM_UPDATE_COMMAND)
    .then(() => console.log('Selenium setup complete.'));
}
