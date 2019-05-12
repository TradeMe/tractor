// Dependencies:
import { ProtractorBrowser } from 'protractor';

// Constants:
const MAC_OS = 'Mac OS';
const WINDOWS = 'Windows';
const PLATFORM_NAMES: Record<string, string> = {
    'macOS': MAC_OS,
    'mac': MAC_OS,
    'Mac OS X': MAC_OS,
    'windows': WINDOWS,
    'Windows NT': WINDOWS
};

export async function attachBrowserName (test) {
    const { browser } = global;
    const info = await getBrowserName(browser);

    const suite = test.currentTest.parent;
    if (!suite.title.endsWith(info)) {
        suite.title = `${suite.title}${info}`;
    }
}

async function getBrowserName (browser: ProtractorBrowser) {
    const caps = await browser.driver.getCapabilities();
    const name = caps.get('browserName');
    const [start, ...rest] = name;
    const displayName = `${start.toUpperCase()}${rest.join('')}`;

    const platform = caps.get('platform') || caps.get('platformName');
    const displayPlatform = PLATFORM_NAMES[platform] || platform;

    const version = caps.get('version') || caps.get('browserVersion');

    return ` (${displayName} v${version} on ${displayPlatform})`;
}
