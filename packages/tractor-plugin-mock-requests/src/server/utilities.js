// Constants:
const DEFAULT_DIRECTORY = './tractor/mock-requests';
const DEFAULT_DOMAIN = 'localhost';
const DEFAULT_PORT = 8765;

// Dependencies:
import request from 'request-promise-native';

export function createProxyUrl (config, url) {
    let { domain, port } = config;
    return `http://${domain}:${port}${url}`;
}

export function getConfig (config) {
    config.mockRequests = config.mockRequests || {};
    let { mockRequests } = config;
    mockRequests.directory = mockRequests.directory || DEFAULT_DIRECTORY;
    mockRequests.domain = mockRequests.domain || DEFAULT_DOMAIN;
    mockRequests.port = mockRequests.port || DEFAULT_PORT;
    return mockRequests;
}

// Cannot easily stub `request`, as `proxyquire` doesn't
// work with `babel-register`. Ignoring from coverage for now:
/* istanbul ignore next */
export function setProxyConfig (body, uri) {
    return request({
        body,
        json: true,
        uri
    });
}
