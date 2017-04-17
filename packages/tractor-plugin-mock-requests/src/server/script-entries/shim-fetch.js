/* globals window */

// Dependencies:
import fetchMock from 'fetch-mock';

window.__tractor__ = (function tractorMockRequests (tractor) {
    var originalFetch = window.fetch;
    window.fetch = function (url, options) {
        let mock = tractor.getMatchingMock(options.method, url);
        if (!mock || mock.passthrough) {
            return originalFetch.apply(this, arguments);
        } else {
            fetchMock.restore();
            fetchMock.mock(url, mock.body, mock);
            return fetchMock.fetchMock(url, options);
        }
    };

    return tractor;
})(window.__tractor__);
