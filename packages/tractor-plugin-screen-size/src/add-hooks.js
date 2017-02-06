// Constants:
const DEFAULT_HEIGHT = 1000;

// Utilities:
import { createTag } from './utilities/create-tag';

export function addHooks (cucumber, config) {
    config.screenSizes = config.screenSizes || {};

    Object.keys(config.screenSizes).forEach(size => {
        cucumber.Before({ tags: createTag(size) }, () => {
            let { height, width } = config.screenSizes[size];

            if (!width) {
                width = config.screenSizes[size];
            }

            if (!height) {
                height = DEFAULT_HEIGHT;
            }

            global.browser.driver.manage().window().setSize(width, height);
        });
    });
}
