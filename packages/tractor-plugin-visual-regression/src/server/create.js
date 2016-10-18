// Constants:
import CONSTANTS from './constants';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
const fs = Promise.promisifyAll(require('fs'));
import path from 'path';
import PNGFile from './PNGFile';

export default function create (browser, config) {
    return new VisualRegression(browser, config);
}

class VisualRegression {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = config;
    }

    takeScreenshot (name) {
        return this.browser.takeScreenshot()
        .then(png => {
            return this.saveScreenshot(png, name);
        });
    }

    saveScreenshot (png, name) {
        let fileName = this.createFileName(name);
        let filePath = path.join(this.config.testDirectory, CONSTANTS.VISUAL_REGRESSION_DIRECTORY, CONSTANTS.BASELINE_DIRECTORY, fileName);

        return fs.statAsync(filePath)
        .catch(() => {
            filePath = path.join(this.config.testDirectory, CONSTANTS.VISUAL_REGRESSION_DIRECTORY, CONSTANTS.CHANGES_DIRECTORY, fileName);
        })
        .then(() => {
            let stream = fs.createWriteStream(filePath);
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        });
    }

    createFileName (name) {
        return `${name}.${PNGFile.extension}`;
    }
}
