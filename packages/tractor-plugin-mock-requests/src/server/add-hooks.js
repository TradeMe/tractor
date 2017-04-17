import { MockRequests } from './mock-requests';

export default function addHooks (browser, config, cucumber) {
    cucumber.Before(function (scenario, callback) {
        global.mockRequests = new MockRequests(browser, config);
        callback();
    });

    cucumber.After(function (scenario, callback) {
        global.mockRequests.clear();
        callback();
    });
}
addHooks['@Inject'] = ['browser', 'config', 'cucumber'];
