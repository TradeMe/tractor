/* globals window */

// Dependencies:
import fetchMock from 'fetch-mock';

window.__tractor__ = (function tractorMockRequests (tractor) {
    let originalFetch = window.fetch;
    window.fetch = function (url, options) {
        let { method } = options;
        let mock = tractor.getMatchingMock(method, url);

        if (!mock) {
            let message = `Unexpected "${method}" request to "${url}".`;
            console.error(message);
        }

        if (!mock || mock && mock.passThrough) {
            return originalFetch.apply(this, arguments);
        }

        fetchMock.restore();
        fetchMock.mock(url, mock.body, mock);
        return fetchMock.fetchMock(url, options);
    };

    return tractor;
})(window.__tractor__);
