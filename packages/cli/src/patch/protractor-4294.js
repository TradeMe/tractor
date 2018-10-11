// Dependencies:
import { error, info } from '@tractor/logger';
import fs from 'fs';
import path from 'path';

export async function protractor4294 () {
    let chromeJsPath = 'node_modules/selenium-webdriver/chrome.js';
    
    try {
        chromeJsPath = path.join(path.dirname(require.resolve('selenium-webdriver')), 'chrome.js');
    
        const data = await fs.readFileAsync(chromeJsPath, 'utf8');
        
        const result = data.replace(
            /new http.HttpClient\(url\)/g,
            `new http.HttpClient(url, new (require('http').Agent)({ keepAlive: true }))`
        );
        
        info(`Attempting to patching ${chromeJsPath}...`);
        info('See https://github.com/angular/protractor/issues/4294#issuecomment-408950204 for details.');
    
        await fs.writeFileAsync(chromeJsPath, result, 'utf8');

    } catch (e) {
        error(`Could not patch ${chromeJsPath}.`);
        throw e;
    }
}