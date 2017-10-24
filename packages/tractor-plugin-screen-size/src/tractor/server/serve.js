// Dependencies:
import { createTag } from './utilities';

export function serve (config) {
    Object.keys(config.screenSizes)
    .forEach(size => {
        config.tags.push(createTag(size));
    });
}
serve['@Inject'] = ['config'];
