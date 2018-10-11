// Dependencies:
import { browserInfo } from './browser-info';
import { debug } from './debug';

afterEach(async function () {
    await browserInfo(this);
    debug(this);
});
