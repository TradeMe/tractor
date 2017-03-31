import { MockRequests } from './mock-requests';

export function addHooks (browser, cucumber) {
    cucumber.Before(function (scenario, callback) {
        global.mockRequests = new MockRequests(browser);
        callback();
    });

    cucumber.After(function (scenario, callback) {
        global.mockRequests.clear();
        callback();
    });
}
