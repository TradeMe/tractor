// Dependencies:
import fs from 'fs';
import path from 'path';

// Constants:
const SCREENSHOT_DIRECTORY = 'screenshots';

function create (browser, config) {
    try {
        fs.mkdirSync(path.join(config.testDirectory, SCREENSHOT_DIRECTORY));
    } catch (e) {
        console.error(e);
    }
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
        .then((png) => {
            return this.saveScreenshot(png, path.join(this.config.testDirectory, SCREENSHOT_DIRECTORY, name));
        });
    }

    saveScreenshot (png, path) {
        let stream = fs.createWriteStream(path);
        stream.write(new Buffer(png, 'base64'));
        stream.end();
    }
}

export default create;
