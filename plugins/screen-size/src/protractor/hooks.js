// Dependencies:
import path from 'path';

// Constants:
const MOCHA_HOOKS_FILE_PATH = path.resolve(__dirname, './frameworks/mocha.js');

export function mocha (protractorConfig) {
    protractorConfig.specs = protractorConfig.specs || [];
    protractorConfig.specs.unshift(MOCHA_HOOKS_FILE_PATH);
}
