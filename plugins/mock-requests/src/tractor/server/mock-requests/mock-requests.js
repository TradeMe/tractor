// Constants:
const METHODS = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];

// Dependencies:
import fs from 'fs';
import path from 'path';
import { setProxyConfig } from '../utilities';

// Scripts:
const INIT = fs.readFileSync(path.resolve(__dirname, '../../../scripts/init.js'), 'utf8');
const INIT_SERVICEWORKER = fs.readFileSync(path.resolve(__dirname, '../../../scripts/init_serviceworker.js'), 'utf8');

export class MockRequests {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = config;

        addMethods.call(this);

        if (this.config.mode === 'proxy') {
            monkeypatchGet.call(this);
        }
    }

    clear () {
        this.initialised = false;
        if (this.config.mode === 'proxy') {
            return this.browser.executeScript(INIT);
        } else if (this.config.mode === 'serviceworker') {
            return this.browser.executeScript(INIT_SERVICEWORKER);
        }
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

    if (config.mode === 'proxy') {
        let mock = createMockResponseScript(key, response);
        if (!this.initialised) {
            return setProxyConfig({ mock }, createProxyUrl(config, '/mock-requests/add-mock'));
        } else {
            return this.browser.executeScript(mock);
        }
    } else if (config.mode === 'serviceworker') {
        return this.browser.executeScript(getServiceWorkerMockResponseScript(key, response));
    }
    
}

function createMockResponseScript (key, response) {
    return `window.__tractor__.mockResponses['${key}'] = ${response};`;
}

function getServiceWorkerMockResponseScript (key, response) {
    return `
    if (navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
          registration.active.postMessage({ type: 'mock', key: '${key}', response: '${response}' });
        });
    }`;
}

export function createProxyUrl (config, url) {
    let { domain, port } = config;
    return `http://${domain}:${port}${url}`;
}
