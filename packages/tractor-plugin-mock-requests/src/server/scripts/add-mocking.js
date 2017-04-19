/* globals window */

window.__tractor__ = window.__tractor__ || {};

(function (tractor) {
    tractor.getMatchingMock = function (method, url) {
        let possibleResponses = Object.keys(tractor.mockResponses).filter(key => {
            let response = JSON.parse(key);
            let isMethod = response.method === method;
            let isMatch = new RegExp(response.matcher).test(url);
            return isMethod && isMatch;
        });
        if (possibleResponses.length > 0) {
            if (possibleResponses.length > 1) {
                console.error(`Multiple possible responses found for "${method}" request to "${url}". Use a more specific matcher. Using first matched response...`);
            }
            let [response] = possibleResponses;
            return tractor.mockResponses[response];
        }
    }
})(window.__tractor__);
