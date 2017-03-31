// Dependencies:
import * as fs from 'fs';

// Scripts:
const ADD_MOCKING = fs.readFileSync('./scripts/add-mocking.js', 'utf8');
const INIT = fs.readFileSync('./scripts/init.js', 'utf8');
const SHIM_FETCH = fs.readFileSync('./scripts/shim-fetch.js', 'utf8');
const SHIM_XHR = fs.readFileSync('./scripts/shim-xhr.js', 'utf8');
const MOCK_REQUEST = fs.readFileSync('./scripts/mock-request.js', 'utf8');

// Constants:
const METHODS = ['GET', 'PUT', 'HEAD', 'POST', 'DELETE', 'PATCH'];

export class MockRequests {
    constructor (
        browser
    ) {
        this.browser = browser;
        METHODS.forEach(method => {
            this[`when${method}`] = (url, options) => {
                return when.call(this, method, url, options);
            };
        });
        this.browser.executeScript(`
            ${INIT}
            ${SHIM_FETCH}
            ${SHIM_XHR}
            ${ADD_MOCKING}
        `);
    }

    clear () {
        return this.browser.executeScript(INIT);
    }
}

function when (method, matcher, options = {}) {
    let { code, headers, passThrough, response } = options;

    if (matcher instanceof RegExp) {
        let { source, flags } = matcher;
        matcher = `/${source}/${flags}`;
    }

    let stubScript = MOCK_REQUEST
        .replace(/URL/, matcher)
        .replace(/CODE/, JSON.stringify(code || 200))
        .replace(/HEADERS/, JSON.stringify(headers || []))
        .replace(/PASSTHROUGH/, JSON.stringify(!!passThrough || false))
        .replace(/RESPONSE/, JSON.stringify(response || {}));
    return this.browser.executeScript(stubScript);
}
