// Constants:
const DEFAULT_HEIGHT = 1000;

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import { TractorError } from 'tractor-error-handler';

export class ScreenSize {
    constructor (browser, config) {
        this.browser = browser;
        this.config = config;

        this.config.screenSizes = this.config.screenSizes || {};
    }

    setSize (size) {
        let dimensions = this.config.screenSizes[size];

        if (!dimensions) {
            return Promise.reject(new TractorError(`Cannot find a screen size configuration for "${size}"`));
        }

        let { height, width } = dimensions;

        if (!width) {
            width = this.config.screenSizes[size];
        }

        if (!height) {
            height = DEFAULT_HEIGHT;
        }

        return this.browser.driver.manage().window().setSize(width, height);
    }
}
