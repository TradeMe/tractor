/* globals window */

// Dependencies:
import FakeXMLHttpRequest from 'fake-xml-http-request';

window.__tractor__ = (function tractorMockRequests (tractor) {
    var originalXHR = window.XMLHttpRequest;

    tractor.shimXHR = function () {
        window.XMLHttpRequest = FakeXMLHttpRequest;
    };

    tractor.restoreXHR = function () {
        window.XMLHttpRequest = originalXHR;
    };

    tractor.shimXHR();

    return tractor;
})(window.__tractor__);
