// Utilities:
import { createTag } from './utilities/create-tag';

// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

export default function addHooks (cucumber, config) {
    config.screenSizes = config.screenSizes || {};

    let screenSize = new ScreenSize(global.browser, config);

    Object.keys(config.screenSizes)
    .forEach(size => {
        cucumber.Before({ tags: [createTag(size)] }, () => {
            screenSize.setSize(size);
        });
    });
}
