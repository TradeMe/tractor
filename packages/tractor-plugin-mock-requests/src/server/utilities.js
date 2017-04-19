// Constants:
const DEFAULT_PORT = 8765;

// Dependencies:
import request from 'request-promise-native';

export function createProxyUrl (config, url) {
    let { port } = getConfig(config);
    return `http://localhost:${port}${url}`;
}

export function getConfig (config) {
    config = config.mockRequests || {};
    config.port = config.port || DEFAULT_PORT;
    return config;
}

export function setProxyConfig (body, uri) {
    return request({
        body,
        json: true,
        uri
    });
}
