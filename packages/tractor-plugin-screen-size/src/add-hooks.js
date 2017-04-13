// Utilities:
import { createTag } from './utilities/create-tag';

// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

export default function addHooks (browser, cucumber, config) {
    config.screenSizes = config.screenSizes || {};

    let screenSize = new ScreenSize(browser, config);

    Object.keys(config.screenSizes)
    .forEach(size => {
        cucumber.Before({ tags: [createTag(size)] }, () => {
            return screenSize.setSize(size);
        });
    });
}
addHooks['@Inject'] = ['browser', 'cucumber', 'config'];
