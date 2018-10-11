// Dependencies:
import request from 'request-promise-native';

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
