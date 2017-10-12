// Constants:
const METHODS = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];

// Utilities:
import fs from 'graceful-fs';
import path from 'path';
import { setProxyConfig } from '../utilities';

// Scripts:
const INIT = fs.readFileSync(path.resolve(__dirname, '../../../scripts/init.js'), 'utf8');

export class MockRequests {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = config;
        this.initialised = false;

        addMethods.call(this);
        monkeypatchGet.call(this);
    }

    clear () {
        return this.browser.executeScript(INIT);
    }
}

function addMethods () {
    METHODS.forEach(method => {
        this[`when${method}`] = (matcher, options) => {
            return when.call(this, method, matcher, options);
        };
    });
}

function monkeypatchGet () {
    let { browser, config } = this;
    let mockRequests = this;

    if (!browser.originalGet) {
        browser.originalGet = browser.get;
    }

    browser.get = function (destination, timeout) {
        mockRequests.initialised = true;
        return browser.originalGet.call(browser, createProxyUrl(config, destination), timeout);
    };
}

function when (method, matcher, options = {}) {
    let { config } = this;
    let { body, headers, passThrough, status } = options;

    body = body || {};
    headers = headers || {};
    matcher = matcher.source.replace(/\\/g, '\\\\');
    passThrough = !!passThrough || false;
    status = status || 200;

    body = JSON.stringify(body);
    let key = JSON.stringify({ method, matcher });
    let response = JSON.stringify({ body, headers, matcher, method, passThrough, status });
    let mock = createMockResponseScript(key, response);

    if (!this.initialised) {
        return setProxyConfig({ mock }, createProxyUrl(config, '/mock-requests/add-mock'));
    } else {
        return this.browser.executeScript(mock);
    }
}

function createMockResponseScript (key, response) {
    return `window.__tractor__.mockResponses['${key}'] = ${response};`
}

export function createProxyUrl (config, url) {
    let { domain, port } = config;
    return `http://${domain}:${port}${url}`;
}
