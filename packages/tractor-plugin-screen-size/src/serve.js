// Utilities:
import { createTag } from './utilities/create-tag';

// Dependencies:
import { getConfig } from 'tractor-config-loader';

let config = getConfig();

export function serve () {
    config.screenSizes = config.screenSizes || {};

    Object.keys(config.screenSizes)
    .forEach(size => {
        config.tags.push(createTag(size));
    });
}
