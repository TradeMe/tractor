'use strict';

// Utilities:
import Promise from 'bluebird';

export default function featureTransformer (file, options) {
    let { oldName, newName } = options;
    let oldNameRegExp = new RegExp(`(Feature:\\s)${oldName}(\\r\\n|\\n)`);

    file.content = file.content.replace(oldNameRegExp, `$1${newName}$2`);
    return Promise.resolve();
}
