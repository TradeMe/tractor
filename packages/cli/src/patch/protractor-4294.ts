// Dependencies:
import { error, info } from '@tractor/logger';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function protractor4294 (): Promise<void> {
    let chromeJsPath = 'node_modules/selenium-webdriver/chrome.js';

    try {
        chromeJsPath = path.join(path.dirname(require.resolve('selenium-webdriver')), 'chrome.js');

        const data = await readFile(chromeJsPath, 'utf8');

        const result = data.replace(
            /new http.HttpClient\(url\)/g,
            `new http.HttpClient(url, new (require('http').Agent)({ keepAlive: true }))`
        );

        info(`Attempting to patching ${chromeJsPath}...`);
        info('See https://github.com/angular/protractor/issues/4294#issuecomment-408950204 for details.');

        await writeFile(chromeJsPath, result, 'utf8');

    } catch (e) {
        error(`Could not patch ${chromeJsPath}.`);
        throw e;
    }
}
