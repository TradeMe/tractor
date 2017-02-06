// Utilities:
import { createTag } from './utilities/create-tag';

export default function serve (application, config) {
    config.screenSizes = config.screenSizes || {};

    Object.keys(config.screenSizes)
    .forEach(size => {
        config.tags.push(createTag(size));
    });
}
