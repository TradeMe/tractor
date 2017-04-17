// Constants:
const METHODS = ['GET', 'PUT', 'HEAD', 'POST', 'DELETE', 'PATCH'];
const DEFAULT_PORT = 8765;

// Utilities:
import fs from 'fs';
import path from 'path';

// Dependencies:
import request from 'request-promise-native';

// Scripts:
const INIT = fs.readFileSync(path.resolve(__dirname, './scripts/init.js'), 'utf8');
const MOCK_REQUEST = fs.readFileSync(path.resolve(__dirname, './scripts/mock-request.js'), 'utf8');

export class MockRequests {
    constructor (
        browser,
        config
    ) {
        this.browser = browser;
        this.config = getConfig(config);
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

function getConfig (config) {
    config = config.mockRequests || {};
    config.port = config.port || DEFAULT_PORT;
    return config;
}

function monkeypatchGet () {
    let { browser, config } = this;
    let { port } = config;

    let mockRequests = this;
    let originalGet = browser.get;

    browser.get = function (destination, timeout) {
        let { initialised } = mockRequests;
        if (!initialised) {
            mockRequests.initialised = true;
        }

        let host = browser.baseUrl;
        return request({
            body: { host },
            json: true,
            uri: `http://localhost:${port}/mock-requests/set-host`
        })
        .then(() => originalGet.call(browser, `http://localhost:${port}${destination}`, timeout));
    };
}

function when (method, matcher, options = {}) {
    let { config } = this;
    let { port } = config;

    let { body, headers, passThrough, status } = options;

    body = body || {};
    headers = headers || [];
    passThrough = !!passThrough || false;
    status = status || 200;

    if (matcher instanceof RegExp) {
        let { source } = matcher;
        matcher = source;
    }

    body = JSON.stringify(body);
    let mock = MOCK_REQUEST
        .replace(/KEY/, JSON.stringify({ method, matcher }))
        .replace(/'DATA'/, JSON.stringify({ body, headers, matcher, method, passThrough, status }));

    if (!this.initialised) {
        return request({
            body: { mock },
            json: true,
            uri: `http://localhost:${port}/mock-requests/add-mock`
        });
    } else {
        return this.browser.executeScript(mock);
    }
}
