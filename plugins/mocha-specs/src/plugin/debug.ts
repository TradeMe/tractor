// Dependencies:
import { error, info } from '@tractor/logger';
import addContext from 'mochawesome/addContext';

export async function debug (test) {
    const browser = global.browser || {};
    const params = browser.params || {};

    if (params.debug === 'true' && test.currentTest.state !== 'passed') {
        // eslint-disable-next-line no-debugger
        debugger;
    }

    if (browser && test.currentTest.state !== 'passed') {
        return Promise.all([getBrowserLog(browser, test), takeScreenshot(browser, test)]);
    }
}

async function getBrowserLog (browser, test) {
    try {
        let consoleOutput = '';
        let browserLog = await browser.manage().logs().get('browser');
        if (browserLog.length > 0) {
            info('Browser console output:');
            browserLog.forEach(log => {
                consoleOutput += `${log.message}\n`;
                error(log.message);
            });
        }

        if (consoleOutput.length) {
            addContext(test, {
                title: 'Browser console output',
                value: consoleOutput
            });
        }
    } catch {
        error('Could not get browser console output.');
    }
}

async function takeScreenshot (browser, test) {
    try {
        let base64png = await browser.takeScreenshot();
        addContext(test, {
            title: 'Browser screenshot',
            value: `data:image/png;base64,${base64png}`
        });
    } catch {
        error('Could not take browser screenshot.');
    }
}
