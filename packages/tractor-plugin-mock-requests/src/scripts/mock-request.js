/* globals window, CODE, HEADERS, PASSTHROUGH, RESPONSE, URL */

window.__tractor__ = window.__tractor__ || {};

(function (tractor) {
    tractor.mockResponses[URL] = {
        code: CODE,
        headers: HEADERS,
        isPassThrough: PASSTHROUGH,
        response: RESPONSE
    };

})(window.__tractor__);
