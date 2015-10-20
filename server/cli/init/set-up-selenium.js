'use strict';

// Constants:
import constants from '../../constants';

// Utilities:
import { promisifyAll } from 'bluebird';
const childProcess = promisifyAll(require('child_process'));
import log from 'npmlog';

export default {
    run: setUpSelenium
};

function setUpSelenium () {
    log.info('Setting up Selenium...');
    return childProcess.execAsync(constants.SELENIUM_UPDATE_COMMAND)
    .then(() => log.verbose('Selenium setup complete.'));
}
