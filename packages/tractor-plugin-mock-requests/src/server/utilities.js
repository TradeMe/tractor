// Constants:
const DEFAULT_DOMAIN = 'localhost';
const DEFAULT_PORT = 8765;

// Dependencies:
import request from 'request-promise-native';

export function createProxyUrl (config, url) {
    let { domain, port } = getConfig(config);
    return `http://${domain}:${port}${url}`;
}

export function getConfig (config) {
    config = config.mockRequests || {};
    config.domain = config.domain || DEFAULT_DOMAIN;
    config.port = config.port || DEFAULT_PORT;
    return config;
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
