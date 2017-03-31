/* globals window */

// Dependencies:
import fetchMock from 'fetch-mock';

window.__tractor__ = (function tractorMockRequests (tractor) {
    var originalXHR = window.XMLHttpRequest;

    tractor.fetchMock = fetchMock;
    tractor.shimFetch = function () {
        window.fetch = fetchMock.fetchMock;
    };

    tractor.restoreFetch = function () {
        window.fetch = originalXHR;
    };

    tractor.shimFetch();

    return tractor;
})(window.__tractor__);
