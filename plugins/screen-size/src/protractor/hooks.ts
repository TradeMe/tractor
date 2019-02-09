// Dependencies:
import * as path from 'path';
import { Config } from 'protractor';

// Constants:
const MOCHA_HOOKS_FILE_PATH = path.resolve(__dirname, './frameworks/mocha.js');

export function mocha (protractorConfig: Config): void {
    protractorConfig.specs = protractorConfig.specs || [];
    protractorConfig.specs.unshift(MOCHA_HOOKS_FILE_PATH);
}
