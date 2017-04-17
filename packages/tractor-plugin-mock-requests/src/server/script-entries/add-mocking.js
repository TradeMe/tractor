/* globals window */

// Dependencies:
import { TractorError } from 'tractor-error-handler';

window.__tractor__ = window.__tractor__ || {};

(function (tractor) {
    tractor.getMatchingMock = function (method, url) {
        var possibleResponses = Object.keys(tractor.mockResponses).filter(function (key) {
            var response = JSON.parse(key);
            let isMethod = response.method === method;
            let isMatch = new RegExp(response.matcher).test(url);
            return isMethod && isMatch;
        });
        if (possibleResponses.length === 1) {
            var response = possibleResponses[0];
            return tractor.mockResponses[response];
        } else if (possibleResponses.length > 1){
            throw new TractorError(`Multiple possible responses found for "${method}" request to "${url}". Use a more specific matcher.`);
        } else {
            throw new TractorError(`Unexpected "${method}" request to ""${url}".`);
        }
    }
})(window.__tractor__);
