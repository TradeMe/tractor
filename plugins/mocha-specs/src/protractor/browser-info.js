// Dependencies:
import { error, info } from '@tractor/logger';
import addContext from 'mochawesome/addContext';

export async function browserInfo (test) {
    const { browser } = global;
    const info = await getBrowserInfo(browser);

    const suite = test.currentTest.parent;
    if (!suite.title.endsWith(info)) {
        suite.title = `${suite.title}${info}`;
    }

    if (browser && test.currentTest.state !== 'passed') {
        return Promise.all([getBrowserLog(browser, test), takeScreenshot(browser, test)]);
    }
}

const MAC_OS = 'Mac OS';
const PLATFORM_NAMES = {
    'macOS': MAC_OS,
    'mac': MAC_OS,
    'Mac OS X': MAC_OS
};

async function getBrowserInfo (browser) {
    const caps = await browser.driver.getCapabilities();
    const name = caps.get('browserName');
    const [start, ...rest] = name;
    const displayName = `${start.toUpperCase()}${rest.join('')}`;

    const platform = caps.get('platform') || caps.get('platformName');
    const displayPlatform = PLATFORM_NAMES[platform] || platform;

    const version = caps.get('version') || caps.get('browserVersion');

    return ` (${displayName} v${version} on ${displayPlatform})`;
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
