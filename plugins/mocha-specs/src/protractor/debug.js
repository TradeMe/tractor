// Dependencies:
import { info } from '@tractor/logger';

export function debug (test) {
    let browser = global.browser || {};
    let params = browser.params || {};
    if (params.debug === 'true' && test.currentTest.state !== 'passed') {
        info('Starting protractor debugger.');
        // eslint-disable-next-line no-debugger
        debugger;
    }
}
