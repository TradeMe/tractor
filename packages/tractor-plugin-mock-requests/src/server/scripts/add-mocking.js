/* globals window */

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
            // throw new Error();
        } else {
            // throw new Error();
        }
    }
})(window.__tractor__);
